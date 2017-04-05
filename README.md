# HW #3 Proxies, Queues, Cache Fluency.

## Setting up the Repository:
In order to set up the repository execute the following steps:

a. Clone this repository.

b. cd into the directory.

c. Run the following command to download the required modules:
```
npm install
```

This sets up the required modules in the folder.

## Executing the program:
a. Start the redis instance on your system. Be sure to start redis on the port 6379 for the program to work correctly.

b. In a new terminal execute the following command:

```
redis-server
node main.js 3001
```

Note: you can do this in the same terminal as well. Use '&' at the end of the command:
```
node main.js 3001 &
```

This runs the process as a daemon. Navigate to web browser and open **localhost:3001**. You will see the results. For each feature use the routes as mentioned during the redis workshop.

c. Now run the proxy server via the following command:
```
sudo node proxy.js
```

d. Navigate to localhost:3000 on your browser as we are listening on 3000 port.
You should be able to see the following message on your web page. You will be able to see that all the above routes are alternating between different ports.

### [Screencast](https://youtu.be/IJipJNF3BOY)

## Conceptual Questions
1. Describe some benefits and issues related to using Feature Flags.
  - Benefits:
     - Without deploying, the developers can test results on few users.
     - Developers can collect the data and verify their features.
     - Rather deploying a wrong feature, they will wait for the new feature to be successful. It will save time and money.
  - ISSUES: 
     - Users might use feature differently than devs expected.
     - Feature flags are “technical debt”
     - Complexity of running multiple versions of the same thing in parallel with only one version visible to a given customer at a time.
     - Removing flags is a highly variable practice. Hard to test deployment and impact

2. What are some reasons for keeping servers in seperate availability zones?
   - Load balancing
   - isolated production environment so if one zone is down the others will take care.
   - Reduced accessible times.
   - Rerouting web traffic requests.
   - Quick content delivery.
3. Describe the Circuit Breaker pattern and its relation to operation toggles.
   - Ops toggles are a generalisation of the circuit breaker pattern.
   - You wrap a protected function call in a circuit breaker object, which monitors for failures. Once the failures reach a certain threshold, the circuit breaker trips, and all further calls to the circuit breaker return with an error.
   - Ops toggles, will respond similary during feature flags. They will keep working until a threshold is reach for failures. As soon as the feature fails, the flag will stop and previous version of the application will be deployed to stop any unwanted mess to the users.
4. What are some ways you can help speed up an application that has
   - **traffic that peaks on Monday evenings**: Have more servers to handle request for the peak time. Cache frequent requests of peak time users.
   - **real time and concurrent connections with peers**: different availability of servers in different zones. Provide a good route with the lowest traffic.
   - **heavy upload traffic**: distributed upload to servers.