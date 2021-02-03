import React, { Component } from "react";
import AuthService from "../services/auth.service";
import TaskService from "../services/task.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
var valid = true;
const required = value => {
    if (!value && valid) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class Task extends Component {
    constructor(props) {
        super(props);

        this.handleAddOrEdit = this.handleAddOrEdit.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDetail = this.onChangeDetail.bind(this);


        this.loadTable();
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            id: "",
            title: "",
            detail: "",
            loading: false,
            task_list: [],
            mode: "Add"
        };
        if (this.state.currentUser == null) {
            props.history.push("/login");
            window.location.reload();
        }
    }

    onDeleteTask(id) {
        let task_id = {
            "id": id
        }
        TaskService.deleteTask(task_id).then(
            response => {
                this.loadTable();
            }
        );
    }

    onEditTask(index) {
        let task = this.state.task_list[index]

        this.setState({
            title: task.title,
            detail: task.detail,
            id: task.id,
            mode: "Update"
        });

    }

    loadTable() {
        TaskService.getAllTask().then(
            response => {
                this.setState({
                    task_list: response.data.data,
                });
            }
        );
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDetail(e) {
        this.setState({
            detail: e.target.value
        });
    }

    handleAddOrEdit(e) {
        e.preventDefault();
        this.form.validateAll();

        this.setState({
            message: "",
            loading: true
        });

        if (this.checkBtn.context._errors.length === 0) {
            if (this.state.id == "") {
                TaskService.addTask(this.state.title, this.state.detail).then(
                    response => {
                        this.loadTable()
                        valid = false;
                        this.setState({
                            message: response.data.message,
                            loading: false,
                            title: "",
                            detail: ""
                        });
                        valid = false;
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

                        this.setState({
                            loading: false,
                            message: resMessage
                        });
                    }
                );
            } else {
                let data = {
                    title: this.state.title,
                    detail: this.state.detail
                }
                TaskService.updateTask(this.state.id, data).then(
                    response => {
                        this.loadTable()
                        valid = false;
                        this.setState({
                            message: response.data.message,
                            loading: false,
                            mode: "Add",
                            id: "",
                            title: "",
                            detail: ""
                        });
                        valid = false;
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

                        this.setState({
                            loading: false,
                            message: resMessage
                        });
                    }
                );
            }
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {

        return (
            <div className="row mt-4">
                <div className="col-md-4">
                    <h3>Add/Edit Task</h3>
                    <div className="card mt-2">
                        <Form
                            onSubmit={this.handleAddOrEdit}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            <Input type="hidden" name="id" value={this.state.id} />
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChangeTitle}
                                    validations={[required]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="detail">Detail</label>
                                <Textarea
                                    className="form-control"
                                    name="detail"
                                    value={this.state.detail}
                                    onChange={this.onChangeDetail}
                                    validations={[required]}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={this.state.loading}
                                >
                                    {this.state.loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>{this.state.mode}</span>
                                </button>
                            </div>

                            {this.state.message && (
                                <div className="form-group">
                                    <div className="alert alert-success" role="alert">
                                        {this.state.message}
                                    </div>
                                </div>
                            )}
                            <CheckButton
                                style={{ display: "none" }}
                                ref={c => {
                                    this.checkBtn = c;
                                }}
                            />
                        </Form>
                    </div>
                </div>
                <div className="col-md-8">
                    <h3>List Task</h3>
                    <div className="card mt-2">

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Detail</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.task_list.length > 0) ? this.state.task_list.map((task, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{task.title}</td>
                                            <td>{task.detail}</td>
                                            <td>
                                                <button
                                                    data-index={index}
                                                    className="btn btn-danger btn-sm mx-1"
                                                    onClick={() => this.onDeleteTask(task.id)} > DELETE</button>
                                                <button
                                                    onClick={() => this.onEditTask(index)}
                                                    className="btn btn-primary btn-sm mx-1"> EDIT</button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan="3">No Task</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    }

}