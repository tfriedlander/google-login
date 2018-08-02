# Google Login

These are some helper functions I find useful for handling google login. I recommend [react-google-login](https://github.com/anthonyjgrove/react-google-login) for use within react

## Example Usage

```
import React from 'react'
import ReactDOM from 'react-dom'
import { clientLogin } from 'google-login'

const CLIENT_ID = 'abc-123-apps.googleusercontent.com`

const { initOAuth, signIn, signOut, onSignInChange, isSignedIn } = clientLogin

function signInChange(loggedIn) {
  console.log('sign in status has changed. User is logged in:', loggedIn)
}

function doAction(e) {
  e.preventDefault()
  if (isSignedIn()) {
    console.log('signing user out')
    signOut().then(() => render('Sign In'))
    return render('Processing...', false)
  }
  console.log('signing user in')
  signIn().then(() => render('Sign Out'))
  return render('Processing...', false)
}

function render(text, clickable=true) {
  const clickableEl = <a href="#" onClick={ doAction }>{ text }</a>
  const nonClickEl = text
  const root = document.getElementById('root')
  const el = <div> { clickable ? clickableEl : nonClickEl } </div>
  ReactDOM.render(el, root)
}

function getUserInfo(cl = clientLogin) {
  const currentUser = cl.isSignedIn() ? cl.currentUser() : null
  if (!currentUser) {
    return null
  }
  const profile = currentUser.getBasicProfile()
  return {
    id: profile.getId(),
    name: profile.getName(),
    givenName: profile.givenName(),
    familyName: profile.getFamilyName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail()
  }
}

// initializing google sign-in
async function init() {
  await initOAuth(CLIENT_ID)
  // set signInChange event callback
  await onSignInChange(signInChange)
  render(isSignedIn() ? 'Sign Out' : 'Sign In')
}

render('Processing...', false)
init()
```
