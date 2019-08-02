pragma solidity 0.5.0;

contract TodoList {
    uint public taskCount = 0;
// declaring an arbitrary value of task using struct
    struct Task {
        uint id;
        string content;
        bool completed;
    }
// Storing the content in the blockchain along with the id
    mapping(uint =>Task) public tasks;

// Creating an event for task creation
    event taskCreated(
        uint id,
        string content,
        bool completed
    );
    event taskCompleted(
        uint id,
        bool completed
    );

// Making the first todlist
    constructor () public {
        createTask("This is your first todoList");
    }

// Function to create a task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount,_content,false);
        // emiting created event
        emit taskCreated(taskCount,_content,false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit taskCompleted(_id,_task.completed);
    }


}