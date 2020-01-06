$('#new-todo-form').submit(function (e) {
  e.preventDefault();
  var todoItem = $(this).serialize();
  $.post('/todos', todoItem, function (data) {
    $('#todo-list').append(
      `
      <li class="list-group-item">
      <form action="/todos/${data._id}" method="POST" class="edit-item-form">
					<div class="form-group">
						<label for="${data._id}">Item Text</label>
						<input type="text" id="${data._id}" value="${data.text}" name="todo[text]" class="form-control">
					</div>
					<button class="btn btn-primary">Update Item</button>
				</form>
				<span class="lead">
					${data.text}
				</span>
				<div class="pull-right">
        <button class="btn btn-sm btn-warning edit-button">Edit</button>
        <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
						<button type="submit" class="btn btn-sm btn-danger">Delete</button>
					</form>
				</div>
				<div class="clearfix"></div>
			</li>
      `
    ); // string version of html markup
    $('#new-todo-form').find('.form-control').val('');
  });
});

$('#todo-list').on('click', '.edit-button', function () { // we must put listener on paretn element of edit button which is static and then all new (dynamic) elements will have listener, otherwise not
  $(this).parent().siblings('.edit-item-form').toggle(); // parent is div.pull-right, its sibling is what we want and it is .edit-form-item
});

$('#todo-list').on('submit', '.edit-item-form', function (e) { // edit item form is dynamic so we add listener to static todo-list
  e.preventDefault(); // prevent form from submitting automatically and submit via ajax
  var todoItem = $(this).serialize();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: todoItem,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      this.originalItem.html(
        `
      <form action="/todos/${data._id}" method="POST" class="edit-item-form">
					<div class="form-group">
						<label for="${data._id}">Item Text</label>
						<input type="text" id="${data._id}" value="${data.text}" name="todo[text]" class="form-control">
					</div>
					<button class="btn btn-primary">Update Item</button>
				</form>
				<span class="lead">
					${data.text}
				</span>
				<div class="pull-right">
					<button class="btn btn-sm btn-warning edit-button">Edit</button>
					<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
						<button type="submit" class="btn btn-sm btn-danger">Delete</button>
					</form>
				</div>
				<div class="clearfix"></div>
      `
      )
    }
  });
});

$('#todo-list').on('submit', '.delete-item-form', function (e) { // delete item form is dynamic so we add listener to static todo-list
  e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
  if (confirmResponse) {
    var actionUrl = $(this).attr('action');
    var $itemToDelete = $(this).closest('.list-group-item'); // closest list-group-item to clicked button
    $.ajax({
      url: actionUrl,
      type: 'DELETE',
      itemToDelete: $itemToDelete,
      success: function (data) {
        this.itemToDelete.remove();
      }
    });
  } else {
    $(this).find('button').blur();
  }
});

$('#search').on('input', function (e) {
  e.preventDefault();
  $.get(`/todos?keyword=${encodeURIComponent(e.target.value)}`, function (data) {
    $('#todo-list').html('');
    data.forEach(function(todo){
      $('#todo-list').append(
        `
        <li class="list-group-item">
					<form action="/todos/${todo._id}" method="POST" class="edit-item-form">
						<div class="form-group">
							<label for="${todo._id}">Item Text</label>
							<input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
						</div>
						<button class="btn btn-primary">Update Item</button>
					</form>
					<span class="lead">
						${todo.text}
					</span>
					<div class="pull-right">
						<button class="btn btn-sm btn-warning edit-button">Edit</button>
						<form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
						</form>
					</div>
					<div class="clearfix"></div>
				</li>
        `
        );
    });
  });
});