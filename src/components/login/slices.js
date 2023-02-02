import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'loggedInUser',
    initialState: {
        user: {
            id: '',
            name: '',
            avatar: '',
            email: '',
            role: 'USER',
            login: false
        }, status: 'idle',
    },
    reducers: {
        // storeUser: (state, action) => {
        //     state.user = action.payload
        // },
        //Add if this user have not logged in to the app before
        // addNewUser: (state, action) => {

        // }
        logoutUser: (state) => {
            state.user = {
                id: '',
                name: '',
                avatar: '',
                email: '',
                role: 'USER',
                login: false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload
            })
    }
})

//Async thunk allow you to do some actions before actually dispatch 
export const checkUserAsync = createAsyncThunk('checkLoginUser', async (data) => {
    let currentUser = data;
    //Get the list of all user (Has logged in to the app before)
    const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`)
        .then((res) => res.json())
        .catch((error) => { console.log(error) })
    let exist = false;

    //Check if this is the new user (Don't present in mockapi database)
    response.forEach(e => {
        if (e.email === data.email) {
            //Get the user id and role if found
            currentUser = {
                ...data,
                role: e.role,
                id: e.id
            }
            exist = true
        }
    })

    //If this is a new user, add to the mockapi list and get the id
    if (!exist) {
        const responseAdd = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify({
                name: data.name,
                avatar: data.avatar,
                email: data.email,
                role: data.role,
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        //After add, mockapi return userId, add this id to current logged in user in redux store
        currentUser = {
            ...data,
            id: responseAdd.id
        }
    }

    //At this point currentUser should have a role and an id
    return currentUser
})