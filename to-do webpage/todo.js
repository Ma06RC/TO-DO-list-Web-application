$(document).ready(function(e) {

	var ERROR_LOG = console.error.bind(console);
	var currentItem;		//global variable for getting the current item that has been selected
	var taskItem;
	
	$('#add-todo').button({
		icons: { primary: "ui-icon-circle-plus" }}).click( function() {
			$('#new-todo').dialog('open');
		});

	$.ajax({
		method: 'GET',
		url:'http://localhost:8080/task_database'
		}).then(function success_comp(data){
		for( var i = 0; i < data.length; i++){
		
			if(data[i].completed){
				var taskHTML = '<li> <span class="done">%</span>';
				taskHTML += '<span class ="delete">x</span>';
				taskHTML += '<span class="task"> </span></li>';
				var $newTask = $(taskHTML);
				$newTask.find('.task').text(data[i].item);
	
				$newTask.hide();
				$('#completed-list').prepend($newTask);
				
				$newTask.show('clip',250).effect('highlight',1000);
				$('#task').val("");			//deletes the last task that the user has entered
			}else{
				var taskHTML = '<li> <span class="done">%</span>';
				taskHTML += '<span class ="delete">x</span>';
				taskHTML += '<span class="task"> </span></li>';
				var $newTask = $(taskHTML);
				$newTask.find('.task').text(data[i].item);
	
				$newTask.hide();
				$('#todo-list').prepend($newTask);
				$newTask.show('clip',250).effect('highlight',1000);
				$('#task').val("");			//deletes the last task that the user has entered
			}
		}
	},ERROR_LOG);
	
	function completed(taskName){
			$.ajax({
				method: 'POST',
				url: 'http://localhost:8080/complete',
				data: JSON.stringify({
					task : taskName
				}),
				contentType: "application/json",
				dataType: "json"
			}).then(function success_comp(data){
				console.log('added to complete.', data);
			},ERROR_LOG);
	}
	

	function to_be_done(taskName){
			$.ajax({
				method: 'PUT',
				url: 'http://localhost:8080/create',
				data: JSON.stringify({
					task: taskName
				}),
				contentType: "application/json",
				dataType: "json"
			}).then( function success_func(data){
				console.log('posted data.', data);
			},ERROR_LOG);
	}	

	function delete_task(taskName){
			$.ajax({
				method: 'DELETE',
				url: 'http://localhost:8080/delete',
				data: JSON.stringify({
					task: taskName
				}),
				contentType: "application/json",
				dataType: "json"
			}).then(function success_func(data){
				console.log('delete item.', data);
			},ERROR_LOG);
	}

	$('#new-todo').dialog({ 
		modal : true, autoOpen : false,
		buttons: {
			"Add task": function(){
				var taskName = $('#task').val();
				to_be_done(taskName);
				
				if(taskName === ''){
					return false;
				}

				var taskHTML = '<li> <span class="done">%</span>';
				taskHTML += '<span class ="delete">x</span>';
				taskHTML += '<span class="task"> </span></li>';
				var $newTask = $(taskHTML);
				$newTask.find('.task').text(taskName);

				$newTask.hide();
				$('#todo-list').prepend($newTask);
				$newTask.show('clip',250).effect('highlight',1000);
				$('#task').val("");			//deletes the last task that the user has entered
				$(this).dialog('close');
			},

			"Cancel": function(){
				$(this).dialog('close');
			}
		}
	});

	$('#delete-item').dialog({
      	autoOpen: false,
      	modal: true,
      	buttons:{
      		"Yes" : function(){
      			$(currentItem).parent('li').effect('puff', function() {
		 		$(currentItem).remove();
				});

				$(this).dialog('close');
      		},

      		"No" : function(){
      			$(this).dialog('close');
      		}
      	}
    });
	
	
	$('.sortlist').on('click','.delete',function() {
		currentItem = $(this);

		var val = $(currentItem).parent('li').text();		//convert the object into a string
		var itemToDelete = val.substring(3, val.length);	//substring the text as it has x and % signs

		delete_task(itemToDelete);		//deletes the item from the server

		$('#delete-item').dialog('open');
	});

	$('#todo-list').on('click', '.done', function() {
		$taskItem = $(this).parent('li');
		$taskItem.slideUp(250, function() {
			var $this = $(this);
		
			var value =  $taskItem.text();		///gets the text of the taskItem as it return OBJECT
			var item = value.substring(3, value.length);	//get the actual taskItem object 
			
			completed(item);		//sets the item to be completed

			$this.detach();
			$('#completed-list').prepend($this);
			$this.slideDown();
		});
	});	

	$('.sortlist').sortable({
		connectWith : '.sortlist',
		cursor : 'pointer',
		placeholder : 'ui-state-highlight',
		cancel : '.delete,.done',
		receive: function( event, ui ) {
			var value = $(ui.item).text();		//get the actual item from the list
			var taskToMove = value.substring(3, value.length);	// substring the item
			
			completed(taskToMove);		//sets the item to be completed with the ajax function
		}
	});

}); // end ready

