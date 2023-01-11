import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'loggedInUser',
    initialState: {
        user: {
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

export const checkUserAsync = createAsyncThunk('checkLoginUser', async (data) => {
    const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`)
        .then((res) => res.json())
        .catch((error) => { console.log(error) })
    // console.log(data)
    // console.log(response)
    let addRole = data;
    response.forEach(e => {
        if (e.email === data.email) {
            // console.log(e)
            addRole = {
                ...data,
                role: e.role
            }
        }
    });
    // console.log(addRole)
    return addRole
})

export const addNewUser = async (data) => {
    const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`)
        .then((res) => res.json())
        .catch((error) => { console.log(error) })
    let exist = false;
    response.forEach(e => {
        if (e.email === data.email) {
            // console.log(e)
            exist = true
        }
    });
    if (!exist) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`, {
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
    }
}