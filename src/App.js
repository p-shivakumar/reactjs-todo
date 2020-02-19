import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {todoList: [], task: ''};
  }

  componentDidMount() {
    this.getAllTask();
  }

  getAllTask() {
    fetch('http://localhost:8080/api/v1/todos', {
      headers: {
        'Content-Type': 'application/json',
        'App': 'ReactJS'
      }
    })
    .then(res => res.json())
    .then((res) => {
      this.setState((state, props) => ({
        todoList: res,
        task: state.task
      }));
    })
    .catch((error) => {
      this.setState((state, props) => ({
        todoList: [],
        task: state.task
      }));   
      console.log(error);
    });    
  }

  createNewTask() {
    fetch('http://localhost:8080/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App': 'ReactJS'
      },
      body: JSON.stringify({task: this.state.task})
    })
    .then(res => res.json())
    .then(res => {
      this.getAllTask();
      this.setState((state, props) => ({ todoList: state.todoList, task: ''}));
    })
    .catch(error => console.log(error));
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      fetch('http://localhost:8080/api/v1/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App': 'ReactJS'
        },
        body: JSON.stringify({task: event.target.value})
      })
      .then(res => res.json())
      .then(res => {
        this.getAllTask();
        this.setState((state, props) => ({ todoList: state.todoList, task: ''}));
      })
      .catch(error => console.log(error));
    }
  }

  handleChange(newTask) {
    this.setState((state, props) => ({ todoList: state.todoList, task: newTask}));
  }

  toggleTaskStatus(taskId, task, event) {
    const status = (event.target.checked) ? 'COMPLETED' : 'PENDING';
    fetch(`http://localhost:8080/api/v1/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'App': 'ReactJS'
      },
      body: JSON.stringify({task: task, status: status})
    })
    .then(res => res.json())      
    .then(res => this.getAllTask())
    .catch(error => console.log(error));
  }

  removeTask(taskId) {
    fetch(`http://localhost:8080/api/v1/todos/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'App': 'ReactJS'
      }
    })
    .then(res => res.json())
    .then(res => this.getAllTask())
    .catch(error => console.log(error));
  }

  render() {
    return (
      <>
        <h1>Todos</h1>
        <div className="todo-container">
          <div className="todo-new">
            <input type="text" name="todo-new" value={this.state.task} onChange={e => this.handleChange(e.target.value)} placeholder="Enter new task" onKeyPress={(e) => this.handleKeyPress(e)} />
          </div>
          <div className="todo-list">
            { this.state.todoList.map(item => 
                <div className="todo-list-item" key={item.id}>
                  <div>
                    <label className="custom-checkbox">&nbsp;
                      <input type="checkbox" name={item.id} checked={item.status === 'COMPLETED'} onChange={e => this.toggleTaskStatus(item.id, item.task, e)} />
                      <span className="checkmark"></span>
                    </label>
                    <span className={item.status === 'COMPLETED' ? "strike-through" : ""}>{ item.task }</span>
                  </div>
                  <div>
                    <span onClick={e => this.removeTask(item.id)}>&times;</span>
                  </div>
                </div>
              ) 
            }
          </div>
        </div>
      </>      
    );
  }

}

export default App;
