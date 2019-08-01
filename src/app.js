// creating an app object
app = {
    loading: false,
    contracts: {},

    // creating an loadfunction inside an app object.
    load: async () => {
        await app.loadWeb3();
        await app.loadAccount();
        await app.loadContract();
        await app.render();
        // await app.renderTasks();
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            app.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            app.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },


    //   Loading account
    loadAccount: async () => {
        app.account = web3.eth.accounts[0];
        console.log('the account associated is', app.account);
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        // console.log(`todoList is:`,todoList);
        app.contracts.Todolist = TruffleContract(todoList);
        app.contracts.Todolist.setProvider(app.web3Provider);
        // console.log(app.contracts.Todolist.setProvider);

        // Getting the values from blockchain by smart contract

        app.todoList = await app.contracts.Todolist.deployed();
        console.log(app.todoList);
    },

    render: async () => {
        if (app.loading) {
            return
        }

        app.setLoading(true);

        $("#account").html(app.account);

        await app.renderTasks();
        app.setLoading(false);
    },

    renderTasks: async () => {
        // load the taskCount from the blockchain
        const taskCount = await app.todoList.taskCount();
        const $taskTemplate = $('.taskTemplate')

        // Rendering each task with a new task template

        for (var i = 1; i <= taskCount; i++) {
            const task = await app.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2]

            // create the HTML for the task
            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)

            // put the task in correct list

            if (taskCompleted) {
                $("#completedTaskList").append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
           
            // show the task
            $newTaskTemplate.show();
        }



    },

    setLoading: (boolean) => {
        app.loading = boolean;

        const loader = $('#loader')
        const content = $('#content')

        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}


$(() => {
    $(window).load(() => {
        app.load()
    })
})