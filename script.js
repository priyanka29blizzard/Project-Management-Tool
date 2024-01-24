let addBtn = document.querySelector('.add-btn');
let removeBtn = document.querySelector('.removal-btn')
let modalCont = document.querySelector('.modal-cont');
let mainCont = document.querySelector('.main-cont');
let textAreaCont = document.querySelector('.textArea-cont')
let allPriorityColors = document.querySelectorAll('.priority-colors');

let colors = ["lightpink", "lightgreen", "lightblue", "black"];

let toolboxColors = document.querySelectorAll('.color');

let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open'; 

let modalPrioritycolor = colors[colors.length-1];

let ticketsArr = [];

// local storage

if(localStorage.getItem('tickets')){
  ticketsArr = JSON.parse(localStorage.getItem('tickets'))
  ticketsArr.forEach(function(ticket){
     createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId)
  })
}

//  Making Tasks visible according to colors

for(let i = 0; i < toolboxColors.length; i++){
   toolboxColors[i].addEventListener('click', function(){
     let selectedToolBoxColor = toolboxColors[i].classList[0];

     let filterdTickets = ticketsArr.filter(function(ticket){
      return selectedToolBoxColor === ticket.ticketColor
     })

    //  console.log(filterdTickets);

     let allTickets = document.querySelectorAll('.ticket-cont')

     for(let i = 0; i <allTickets.length; i++){
      allTickets[i].remove();
     }


     filterdTickets.forEach(function(filterdTicket){
      createTicket(
        filterdTicket.ticketColor,filterdTicket.ticketTask,filterdTicket.ticketId
      )
     })


   })

   toolboxColors[i].addEventListener("dbllick", function (){
    let allTickets = document.querySelectorAll('.ticket-cont');

    for(let i = 0; i < allTickets.length;i++){
      allTickets[i].remove();
    }

    ticketsArr.forEach(function(ticketObj){
         createTicket(
          ticketObj.ticketColor,
          ticketObj.ticketTask,
          ticketObj.ticketId

         );
        
    })
   })

}

// selecting color for your task

allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })

    colorElem.classList.add('active');

    modalPrioritycolor = colorElem.classList[0];
    })
})

 //Display the modal
addBtn.addEventListener('click', function(){
  if(modalCont.style.display =="flex"){
    modalCont.style.display = "none";
  } 
  else{
    modalCont.style.display = "flex";
  }
})

removeBtn.addEventListener('click',function(){
  if(removeBtn.style.color == "red"){
    removeBtn.style.color = "white"
  }
  else{
    alert('delete button has been activated')
    removeBtn.style.color = 'red'
  // }
}
})


modalCont.addEventListener('keydown', function(e){
    let key  = e.key;

    if(key === 'Shift'){
        createTicket(modalPrioritycolor,textAreaCont.value);
        modalCont.style.display = "none";
        textAreaCont.value = "";
    }
})


function createTicket(ticketColor, ticketTask, ticketId){
  let id = ticketId || shortid();
  let ticketCont = document.createElement('div');
  ticketCont.setAttribute('class','ticket-cont');

  ticketCont.innerHTML = `<div class= "ticket-color ${ticketColor}"></div>
  <div class="ticket-id">${id}</div>
  <div class="task-area">${ticketTask}</div>
  <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
   </div>`

  mainCont.appendChild(ticketCont);

  if(!ticketId){
    ticketsArr.push({ticketColor, ticketTask, ticketId:id})
    localStorage.setItem('tickets', JSON.stringify(ticketsArr))
  }

  


 handleRemoval(ticketCont, id);

 handleLock(ticketCont,id);

 handleColor(ticketCont, id);
}


function handleRemoval(ticket, id){
  ticket.addEventListener('click',function(){
      if(removeBtn.style.color == "red") {
       ticket.remove();
      
      
       let idx =getTicketIdx(id);
      ticket.remove() // UI removal

      let deltedElement = ticketsArr.splice(idx, 1 );


      localStorage.setItem('tickets', JSON.stringify(ticketsArr))
      }
      // else{
      //   ticket.remove();
      // }
  })
 }

 function handleLock(ticket, id){
   let ticketLockElem = ticket.querySelector('.ticket-lock');
  
   let ticketLockIcon = ticketLockElem.children[0];

   let ticketTaskArea = ticket.querySelector('.task-area')

   ticketLockIcon.addEventListener('click', function(){

      let ticketIdx = getTicketIdx(id)

      if(ticketLockIcon.classList.contains(lockClass)){
        ticketLockIcon.classList.remove(lockClass);
        ticketLockIcon.classList.add(unlockClass);
        ticketTaskArea.setAttribute('contenteditable', 'true');
      }
      else{
        ticketLockIcon.classList.remove(unlockClass);
        ticketLockIcon.classList.add(lockClass);
        ticketTaskArea.setAttribute('contenteditable', 'true')
      }

     ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText; // updated task
     localStorage.setItem('tickets', JSON.stringify(ticketsArr));

   })
 }

 function handleColor(ticket, id){
   let ticketColorBand = ticket.querySelector('.ticket-color')

   ticketColorBand.addEventListener('click', function(){

    let ticketIdx = getTicketIdx(id);
  
    let currentColor = ticketColorBand.classList[1];

       let currentColorsIdx = colors.findIndex(function(color){
        return currentColor === color;
       })

        currentColorsIdx++;

        let newTicketColor = colors[currentColorsIdx % colors.length];
        ticketColorBand.classList.remove(currentColor);
        ticketColorBand.classList.add(newTicketColor);

        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
   })

 }

 function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketObj){
         return ticketObj.ticketId === id;
 })
 
        return ticketIdx;

 }