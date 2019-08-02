
const TodoList = artifacts.require('./TodoList.sol');

contract('TodoList', (accounts) => {
    // console.log(accounts);
    before(async () => {
        this.todoList = await TodoList.deployed();
    })

    it('Deployed successfully', () => {
        const address = this.todoList.address;
        assert.notEqual(address,'')
        assert.notEqual(address,0x0)
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })

    it('Run Taks', async () => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount);
        assert.equal(task.id.toNumber(),taskCount.toNumber());
        assert.equal(task.content, "This is your first todoList");
        assert.equal(task.completed,false)
    })

})