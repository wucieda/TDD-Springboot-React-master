import React from "react";
import { render, cleanup, fireEvent, waitForNextUpdate } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import {UserSignupPage} from './UserSignupPage';

beforeEach(cleanup);

describe('UserSignupPage', ()=>{
    describe('Layout', ()=>{
        it('has render of Sign Up',()=>{
            const {container} = render(<UserSignupPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up')
        });
        it('has input for display name', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();
        });
        it('has input for user name', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const userNameInput = queryByPlaceholderText('Your username');
            expect(userNameInput).toBeInTheDocument();
        });
        it('has input for password', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });
        it('has password type for password input', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        });
        it('has input for password repeat', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeat).toBeInTheDocument();
        });
        it('has password type for password repeat input', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeat.type).toBe('password');
        });
        it('has submit button', ()=>{
            const {container} = render(<UserSignupPage />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });
    });
    describe('Interactions', ()=>{

        const changeEvent = (content) => {
            return {
                target: {
                value: content
                }
            };
        };

        const mockAsyncDelayed = () =>{
            return jest.fn().mockImplementation(() =>{
                return new Promise((resolve, reject) => {
                    setTimeout(() =>{
                        resolve({});
                    },300)
                })
            })
        }

        let button,displayNameInput, usernameInput, passwordInput, passwordRepeat;

        const setupForSubmit = (props) => {
            const rendered = render(<UserSignupPage {...props} />);
            
            const {container, queryByPlaceholderText}=rendered;
            displayNameInput = queryByPlaceholderText('Your display name');
            usernameInput = queryByPlaceholderText('Your username');
            passwordInput = queryByPlaceholderText('Your password');
            passwordRepeat = queryByPlaceholderText('Repeat your password');

            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

            button = container.querySelector('button');
            return rendered;
        }


        it('set the displayName value into state', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');
                        
            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            expect(displayNameInput).toHaveValue('my-display-name');
        });

        it('set the username value into state', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const usernameInput = queryByPlaceholderText('Your username');
                        
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            expect(usernameInput).toHaveValue('my-user-name');
        });

        it('set the password value into state', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
                        
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            expect(passwordInput).toHaveValue('P4ssword');
        });

        it('set the password repeat value into state', ()=>{
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
                        
            fireEvent.change(passwordRepeat, changeEvent('P4ssword'));
            expect(passwordRepeat).toHaveValue('P4ssword');
        });

        it('calls postSignup when the fields are valid and the actions are provided in props',()=>{
            const actions={
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);

        });

        it('does not throw exception when clicking the button when actions not provided in props',()=>{
            
            setupForSubmit();
            expect(()=>  fireEvent.click(button)).not.toThrow();
            
        });

        it('calls post with user body when the fields are valid',()=>{
            const actions={
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            const expectedUserObject = {
                username: 'my-user-name',
                displayName: 'my-display-name',
                password: 'P4ssword',
            }
            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
        });

        it('does not allow user to clic the Sign Up button when is an ongoing api call',()=>{
            const actions={
                postSignup: mockAsyncDelayed()
            };
            setupForSubmit({actions});
            fireEvent.click(button);
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });

        it('displays spinner when there is an ongoing api call',()=>{
            const actions={
                postSignup: mockAsyncDelayed()
            };
            const {queryByText} = setupForSubmit({actions});
            fireEvent.click(button);
            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();
        });

        //waitForNextUpdate DEPRECATED
        xit('hides spinner after api call finishes successfully', async () => {
            const actions={
                postSignup: mockAsyncDelayed()
            };
            const {queryByText} = setupForSubmit({actions});
            fireEvent.click(button);

            await waitForNextUpdate();

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });

        xit('hides spinner after api call finishes with error', async () => {
            const actions={
                postSignup: jest.fn().mockImplementation(() =>{
                        return new Promise((resolve, reject) => {
                            setTimeout(() =>{
                                reject({
                                    response: {data:{}}
                                });
                            },300)
                        })
                    })
                
            };
            const {queryByText} = setupForSubmit({actions});
            fireEvent.click(button);

            await waitForNextUpdate();

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });
    })
})

console.error = () =>{};