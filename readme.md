Filament AI - Chatbot Technical Task (Backend)
-----------------------------------

**Submitted By**: Matt Kent -

###### Quick Links

- Problem Summary
  
  - Description

- Architecture
  
  - Introduction
  
  - Design Considerations
  
  - Technologies

- Assumptions

- Installation & Deployment

---

## 1. Problem Summary

#### 1.1 Description

**Backend Approach to a Scalable, Robust, Flexible [& Extensible] Chatbot** - Focus is on the suitable approach, process thoughts and architectural considerations, as opposed to a complete solution.

## 2. Architecture

Event-driven microservices; implementing serverless with Kubernetes (K8s) and Kubeless. By parsing and serving user-defined config, service functions are exposed over a REST API, which is again user-configured. This behaviour can be achieved solely through a combination of YAML configuration files and optionally, custom code; for more specific/complex behaviour. Being modular by design, there is no tight coupling of components, therefore, no real limits in terms of customisation. As a result, services are language agnostic. You can specify different runtimes for individual services; where one may utilise Node.js and another Python, it's up to you. As defined in the task description, this rather simple example is written with Node.js.



#### 2.1 Design Considerations

- **Scalability/Stability** - supporting both manual and auto-scaling to demand.

- **Flexibility** - isolated services enforcing the Single Responsibility Principle (SRP), each acting as callable Lambda functions that can be invoked in response to REST API events.

- **Modularity** - decoupled microservices can be easily switched in and out with new behaviour. It's trivial to add new functionality and remove redudant services.

- **Cost** - a combination of both microservices and serverless architecture offers the best of both. Scale to demand, auto-orchestrated through K8s, whilst also reducing computing power by exposing each service as its own lambda function.

- **Deployability** - not locked-in to a cloud provider; can be deployed on your own hardware or the cloud. *Kubeless is officially supported on Google Cloud Platform and Microsoft Azure, however, Kubeless can be removed for a traditional approach to microservices orchestration with k8s.*

- **Extensibility** - tying in with both modularity and flexibility, the architecture focuses significantly on behaving as a skeleton. Independently the app serves as a combined runtime and API gateway/broker. It also supplies providers for both NLP adapters and webhook integrations for messaging clients.

#### 2.2 Technologies

- Node.js

- Kubernetes

- Kubeless

## 3. Assumptions

Listed below are two assumptions I've made whilst completing this backend task.


* **Design Considerations** - task focus is on the architecture and solution design as a whole, not just at a code level. ***i.e.*** *considering the wider deployment aspects with regards to scalability, flexbility, robustness and additionally cost etc*.
  
* **More thought less delivery** - design over implementation: more of an interpretation of the initial spec than an assumption. It was mentioned that this task is more about my thought process behind design decisions than a complete coded solution. Therefore, I have directed most of the time spent on this task into designing the overall architecture of this solution rather than its implementation.
  
  

### Installation/Deployment

The installation instructions detailed below are written with the assumption you already have the following prerequisites installed on the machine you wish to deploy the application on.

#### Prerequisites

- Node.js/NPM or Yarn

- Minikube (Kubernetes)

- Kubeless

#### Installation & Deployment

**Note:** *When deploying on Minikube, you may see errors such as `CrashLoopBackOff` and the application may fail to start. This is typically an indication that the cluster does not have sufficient memory available to it. To resolve this error, make more resources available to the cluster. I'd suggest a minimum of 3GB RAM; you can then try again.*

###### How to setup

1. Create a new Kubernetes (K8s) cluster via the Minikube CLI.
   ```$ minikube start```

2. Verify the cluster by checking the connected nodes.
   ```$ kubectl get nodes``` 
   ***or***
   display the complete information on each node:
   ```$ kubectl describe node```
   
   

3. You can access the Minikube k8s dashboard by running. 
   `$ minikube dashboard`.
   
    *If you want to use the external k8s dashboard you can use `kubectl proxy --port=<port>`. You can obtain the cluster IP by running `$ kubectl cluster-info`.*
   

4. Deploy Kubeless into the Kubernetes cluster (non-RBAC manifest). The `RELEASE` must be the same as the Kubeless version you've installed. The latest is *v1.0.8*. Execute the following in your terminal one after the other:
   
   ```bash
   $ export RELEASE=v1.0.8
   $ kubectl create ns kubeless
   $ kubectl create -f https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless-$RELEASE.yaml
   ```

5. Verify Kubeless was successfully installed by navigating to the Kubernetes dashboard and confirming you see the namespace `kubeless`. To launch the dashboard run:
   
   ```bash
   $ minikube dashboard
   ```

6. Enable the Minikube Ingress addon (support service function routes).
   
   ```bash
   $ minikube addons enable ingress
   ```

7. Deploy the demo service function in its own pod:
   
   ```bash
   $ kubeless function deploy webhook --runtime=nodejs10 --handler=handler.webhook --dependencies=package.json --from-file=handler.js
   ```

8. Verify the deployment status of the webhook function.
   
   ```bash
   $ kubeless function ls webhook
   ```

9. Create secret with user and password
   
   ```bash
   $ htpasswd -cb auth user pass 
   $ kubectl create secret generic basic-auth --from-file=auth
   ```

10.  Create HTTP trigger using the secret
    
    ```bash
    $ kubeless trigger http create webhook --function-name webhook --basic-auth-secret basic-auth --gateway nginx
    ```

11. Verify function is accessible just for the authorised user and password. Replace `<HOST>` and `<ADDRESS>` as required. You should see an authentication required response.
    
    ```bash
    $ kubectl get ingress
    $ curl --header 'Host: <HOST>' <ADDRESS>
    ```

12. Now include the user and password in the curl request. Replace `<HOST>` and `<ADDRESS>` as required.
    
    ```bash
    $ curl -u user:pass --header 'Host: <HOST>' <ADDRESS>
    ```

13.  Send POST request and get random quotes posted back.
    
    ```bash
    $ curl -X POST -u user:pass --header 'Host: <HOST>' --header 'Content-Type: application/json' <ADDRESS> --data '{"message":"Hello there"}'
    ```

**You should get a response containing a random quote each time you send a request. Although not very intuitive, my aim was to demonstrate the benefits of this approach in terms of flexibility, scalability, deployability and cost. You can easily modify/add new functions/microservices without affecting any existing functionality.*

---

## Future possibilties

Given the nature of this task was not to implement a complete solution, there are many desirables left outstanding. However, given the flexibility of this approach, adding adapters for third party NLP services for example, would be a cinch.

A list of improvements I would make include:

- Natural Language Processing (Adapter Support)

- Automation of deployment and configuration (currently it is a manual process but is something that could easily be handled through continuous integration/delivery) or through deployment on third party cloud providers; Google Cloud Platform, Microsoft Azure etc.

- Third party logging providers, i.e. LogDNA (currently logging is handled locally and does not provide the ability to easily search through log history).

- Authentication improvments; JWT - blacklisting tokens after chat session expiry (bloom filter approach etc).

The list goes on...



My aim with this task was to highlight my thoughts behind this approach, and to deliver a suitable example of a backend architecture for a scalable, modular and cost effective solution.
