import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import AccountForm from '../../components/AccountForm';
import './Account.css';
import axios from 'axios';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPass: '',
            userConfirmPass: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdateUser = this.handleUpdateUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    };

    componentDidMount() {

        const userInfo = {
            token: JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])),
            id: JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).id,
            email: JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).email
        };
        console.log(userInfo);

        axios({
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            method: "GET",
            url: `/api/user/${userInfo.id}`
        }).then(userResponse => {
            console.log('=========== frontend ===========');
            console.log(`user id: ${userResponse.data.id}`);
            console.log(`user email: ${userResponse.data.email}`);
            console.log('================================');

            this.setState({ userEmail: userResponse.data.email });
        })
        .catch(err => {
            console.error(err);
        });

        
    }

    // =====================================================================================
    // VALIDATION FUNCTIONS
    // =====================================================================================
    validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    };

    validatePassword = pw => {
        return pw.length > 7;
    };

    validateUpdateForm = (email, pw, confirm) => {
        return this.validateEmail(email) && this.validatePassword(pw) && (pw === confirm);
    };

    isEmptyObj = obj => {
        return Object.keys(obj).length === 0;
    };

    // =====================================================================================
    // HANDLE FUNCTIONS
    // =====================================================================================

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleUpdateUser(e) {
        e.preventDefault();
        
        const id = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).id;
        const currentEmail = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).email;

        const updateInfo = {
            email: this.state.userEmail.toLowerCase(),
            password: this.state.userPass.toLowerCase(),
            confirm: this.state.userConfirmPass.toLowerCase()
        };

        const labels = document.getElementsByTagName('label');
        // for each label
        for (let i = 0; i < labels.length; i++) {
            // if the htmlFor attribute has a value (e.g. <label htmlFor="email"></label>)
            if (labels[i].htmlFor !== '') {
                // assign the associated element with that id (e.g. <input id="email" />) to the variable elem
                const elem = document.getElementById(labels[i].htmlFor);
                if (elem)
                    // then associate that element's label with the current label in the array loop
                    elem.label = labels[i];
            }
        }

        const accountEmailLabel = document.getElementById('account-email').label;
        const accountPasswordLabel = document.getElementById('account-new-pw').label;
        const accountConfirmLabel = document.getElementById('account-confm-pw').label;

        // FORM VALIDATION
        // if password & confirm password are left blank, just validate email
        if (updateInfo.password === "" && updateInfo.confirm === "") {
            // if user has not entered a different email
            if (this.state.userEmail === currentEmail) {
                return;
            } else {
                // if email is not valid
                if (!this.validateEmail(updateInfo.email)) {
                    accountEmailLabel.innerHTML = 'Please enter a valid email';
                    accountEmailLabel.style.color = 'red';
                } else { // if email is valid
                    accountEmailLabel.innerHTML = 'Email';
                    accountEmailLabel.style.color = 'rgb(0, 228, 197)';

                    axios({
                        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
                        method: "PUT",
                        url: `/api/user/${id}`,
                        data: updateInfo
                    }).then(updatedUserResponse => {
                        console.log('=========== frontend ===========');
                        console.log(`email updated: ${updatedUserResponse.data.email}`);
                        console.log('================================');
                    })
                        .catch(err => {
                            console.error(err);
                        });
                }
            }
        // if password field is empty but confirm field has input
        } else if (updateInfo.password === "" && updateInfo.confirm !== "") {
            accountPasswordLabel.innerHTML = 'Please provide a new password:';
            accountPasswordLabel.style.color = 'red';

            // if user has entered a different email
            if (this.state.userEmail === currentEmail) {
                return;
            } else {
                // if email is not valid
                if (!this.validateEmail(updateInfo.email)) {
                    accountEmailLabel.innerHTML = 'Please enter a valid email';
                    accountEmailLabel.style.color = 'red';
                } else { // if email is valid
                    accountEmailLabel.innerHTML = 'Email';
                    accountEmailLabel.style.color = 'rgb(0, 228, 197)';
                }
            }
        // if password field has input but confirm field is empty
        } else if (updateInfo.password !== "" && updateInfo.confirm === "") {
            // validate password
            if (!this.validatePassword(updateInfo.password)) {
                accountPasswordLabel.innerHTML = 'Must be at least 8 characters:';
                accountPasswordLabel.style.color = 'red';
            } else {
                accountPasswordLabel.innerHTML = 'Password:';
                accountPasswordLabel.style.color = 'rgb(0, 228, 197)';

                accountConfirmLabel.innerHTML = 'Please confirm your new password:';
                accountConfirmLabel.style.color = 'red';
            }

            // if user has not entered a different email
            if (this.state.userEmail === currentEmail) {
                return;
            } else {
                // if email is not valid
                if (!this.validateEmail(updateInfo.email)) {
                    accountEmailLabel.innerHTML = 'Please enter a valid email';
                    accountEmailLabel.style.color = 'red';
                } else { // if email is valid
                    accountEmailLabel.innerHTML = 'Email';
                    accountEmailLabel.style.color = 'rgb(0, 228, 197)';
                }
            }
        // if all fields have input
        } else {
            // if user has not entered a different email
            if (this.state.userEmail === currentEmail) {
                // validate password
                if (!this.validatePassword(updateInfo.password)) {
                    accountPasswordLabel.innerHTML = 'Must be at least 8 characters:';
                    accountPasswordLabel.style.color = 'red';
                } else {
                    accountPasswordLabel.innerHTML = 'Password:';
                    accountPasswordLabel.style.color = 'rgb(0, 228, 197)';

                    // validate password match
                    if (updateInfo.password !== updateInfo.confirm) {
                        accountConfirmLabel.innerHTML = 'Passwords do not match:';
                        accountConfirmLabel.style.color = 'red';
                    } else {
                        accountPasswordLabel.innerHTML = 'Password:';
                        accountPasswordLabel.style.color = 'rgb(0, 228, 197)';
                        accountConfirmLabel.innerHTML = 'Confirm Password:';
                        accountConfirmLabel.style.color = 'rgb(0, 228, 197)';

                        axios({
                            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
                            method: "PUT",
                            url: `/api/user/pass/${id}`,
                            data: updateInfo
                        }).then(updatedUserResponse => {
                            console.log('============== frontend ==============');
                            console.log(`info updated for: ${updatedUserResponse.data.email}`);
                            console.log('======================================');
                        })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                }
            } else { // if user has changed email
                // if email is not valid
                if (!this.validateEmail(updateInfo.email)) {
                    accountEmailLabel.innerHTML = 'Please enter a valid email';
                    accountEmailLabel.style.color = 'red';
                } else { // if email is valid
                    accountEmailLabel.innerHTML = 'Email';
                    accountEmailLabel.style.color = 'rgb(0, 228, 197)';
                }

                // validate password
                if (!this.validatePassword(updateInfo.password)) {
                    accountPasswordLabel.innerHTML = 'Must be at least 8 characters:';
                    accountPasswordLabel.style.color = 'red';
                } else {
                    accountPasswordLabel.innerHTML = 'Password:';
                    accountPasswordLabel.style.color = 'rgb(0, 228, 197)';

                    // validate password match
                    if (updateInfo.password !== updateInfo.confirm) {
                        accountConfirmLabel.innerHTML = 'Passwords do not match:';
                        accountConfirmLabel.style.color = 'red';
                    } else {
                        accountPasswordLabel.innerHTML = 'Password:';
                        accountPasswordLabel.style.color = 'rgb(0, 228, 197)';
                        accountConfirmLabel.innerHTML = 'Confirm Password:';
                        accountConfirmLabel.style.color = 'rgb(0, 228, 197)';

                        axios({
                            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
                            method: "PUT",
                            url: `/api/user/pass/${id}`,
                            data: updateInfo
                        }).then(updatedUserResponse => {
                            console.log('============== frontend ==============');
                            console.log(`info updated for: ${updatedUserResponse.data.email}`);
                            console.log('======================================');
                        })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                }
            }
        }
    }

    handleDeleteUser() {
        // trigger modal
    }

    handleConfirmDelete(e) {
        e.preventDefault();
                
        // axios.delete('/api/user/' + updateInfo.id)
        // .then(response => {
        //     console.log(response);
        // })
        // .catch(err => {
        //     console.error(err);
        // });
        // this.props.history.push('/deleted');
    }

    render() {
        return (
            <div className="account-div">
                <Navbar />
                <AccountForm
                    userEmail={this.state.userEmail}
                    userPass={this.state.userPass}
                    userConfirmPass={this.state.userConfirmPass}
                    handleInputChange={this.handleInputChange}
                    handleUpdateUser={this.handleUpdateUser}
                    handleDeleteUser={this.handleDeleteUser}
                />
            </div>
        );
    };
};

export default Account;

// <dialog className="mdl-dialog" id="confirm-delete-modal">
//     <h4 className="mdl-dialog__title"></h4>
//     <div id="delete-modal__content" className="mdl-dialog__content">
//             Are you sure you want to delete your account?
//     </div>
//     <div className="mdl-dialog__actions">
//         <button type="button" className="mdl-button close-modal">NO</button>
//         <button id="confirm-delete-btn" type="button" className="mdl-button">YES</button>
//     </div>
// </dialog>