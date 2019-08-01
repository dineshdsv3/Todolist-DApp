// creating an app object
app = {

    // creating an loadfunction inside an app object.
    load : async () =>{
        console.log("App loading....")
    }

}


$(() => {
    $(window).load(() => {
        app.load()
    })
})