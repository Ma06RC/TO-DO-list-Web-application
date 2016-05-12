# TO-DO-list-Web-application

Steps on running to-do web service application:
  - Go to terminal, cd to where Projet2 file is saved.
  - Type in ￼ in terminal
  - Then open ￼ file and double click index.html,
      this will execute the ‘to-do application’ in the browser.
  - To check if the tasks are added, deleted or updated from
      using the application. You can check it by creating a new tab and type in localhost:8080/task_database
      
      
  Curl tests to test the server side from the terminal: 
   - PUT:
      - curl –H “Content-Type: application/json” –X PUT –d ‘{“task”:”do project”}’ localhost:8080/create
   - DELETE:
      - curl –H “Content-Type: application/json” –X DELETE –d ‘{“task”:”do project”}’ localhost:8080/delete
   - POST:
      - curl –H “Content-Type: application/json” –X POST –d ‘{“task”:”do project”, “completed”:”True”}’ localhost:8080/complete
   - GET:
       - curl localhost:8080/task_database
       
      *Note: if localhost doesn’t work, instead use your ip address. 
      Go to terminal and type in ifconfig. Then look for inet and use it instead of localhost.
     
