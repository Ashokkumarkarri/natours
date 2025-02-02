## 021 Building the User Account Page (also some bugs fixes)

## Bug Fixes

Had fixed 2 bugs

1. cross : there was some error cause related to cros origen error

2.wrong url cause of that the JWT is not creating

1. pacle bundler issues: the version 1 was used y jonas.
   got some errors.

```
    "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js --public-url ./",
    "build:js": "parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js --public-url ./"
```

```

//in app.js
//installed as dev dep

const cors = require('cors'); // Added CORS package

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:8000', // Replace with your frontend origin
    credentials: true, // Allow cookies and other credentials
  }),
);
```

```jsx
//login.js:
//insted of localhost i had used the complete id addres cuase of that the jwt was not created
     url: 'http://localhost:8000/api/v1/users/login',
           withCredentials: true, // This ensures cookies are sent and received
```

---

# Building the User Account Page

## Introduction

In this section, we will build the user account page, primarily using concepts we have already learned. The account page allows users to manage their personal information, upload a profile picture, and update their password.

## Overview of the User Account Page

The user account page contains the following features:

- Navigation menu with user-related options.
- Forms to update user details such as name and email.
- Profile picture upload functionality.
- Password change functionality.
- Admin-specific options (if the user has an admin role).

## Rendering the User Account Page

### Controller Function (viewController.js)

```jsx
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};
```

- This function renders the `account` page when a user navigates to it.
- The page title is set dynamically.

## Account Page Template (account.pug)

### Extending Base Template

```
extends base
```

- This ensures that the `account.pug` template inherits the structure from the base template.

### Navigation Menu

The navigation menu is dynamically generated using a mixin.

```html
mixin navItem(link,text,icon,active) li(class=`${active? 'side-nave--active':
''}`) a(href=`${link}`) svg use(xlink:href=`img/icons.svg#icon-${icon}`) |
#{text}
```

- The `navItem` mixin creates a menu item with an icon and link.
- It highlights the active menu item dynamically.

### Sidebar Navigation

```
block content
    main.main
        .user-view
            nav.user-view__menu
                ul.side-nav
                    +navItem('#','Settings','settings', true)
                    +navItem('#','My booking','briefcase')
                    +navItem('#','My reviews','star')
                    +navItem('#','Billing','settings')
```

- The sidebar menu allows users to navigate between different sections of the account page.
- The `active` parameter determines which menu item is highlighted.

### Admin Navigation (Conditional Rendering)

```
- if (user.role==='admin')
    .admin-nav
        h5.admin-nav__heading Admin
        ul.side-nav
            +navItem('#','Manage tours','map')
            +navItem('#','Manage users','users')
            +navItem('#','Manage reviews','star')
            +navItem('#','Manage bookings','briefcase')
```

- This section is only displayed if the user has an admin role.
- Provides options to manage tours, users, reviews, and bookings.

## User Account Settings Form

```
.user-view__form-container
    h2.heading-secondary.ma-bt-md Your account settings
    form.form.form-user-data
        .form__group
            label.form__label(for='name') Name
            input#name.form__input(type='text' value=`${user.name}`, required)
        .form__group.ma-bt-md
            label.form__label(for='email') Email address
            input#email.form__input(type='email' value=`${user.email}`, required)
```

- Users can update their name and email using this form.
- The values are pre-filled with user data.
- The `required` attribute ensures that fields cannot be left empty.

### Profile Picture Upload

```
.form__group.form__photo-upload
    img.form__user-photo(src=`/img/users/${user.photo}` alt='User photo')
    a.btn-text(href='') Choose new photo
```

- Displays the user's current profile picture.
- Provides an option to upload a new profile picture.

## Password Change Form

```
.user-view__form-container
    h2.heading-secondary.ma-bt-md Password change
    form.form.form-user-settings
        .form__group
            label.form__label(for='password-current') Current password
            input#password-current.form__input(type='password' placeholder='••••••••', required, minlength='8')
        .form__group
            label.form__label(for='password') New password
            input#password.form__input(type='password' placeholder='••••••••', required, minlength='8')
        .form__group.ma-bt-lg
            label.form__label(for='password-confirm') Confirm password
            input#password-confirm.form__input(type='password' placeholder='••••••••', required, minlength='8')
        .form__group.right
            button.btn.btn--small.btn--green Save password
```

- Allows users to update their password.
- Ensures the new password meets a minimum length requirement.
- Includes a confirmation field to verify the new password.
- The `Save password` button submits the form.

## Summary

- The user account page provides options for updating user information, uploading a profile picture, and changing the password.
- The sidebar navigation allows users to switch between different sections.
- Admin users have access to additional management options.
- The forms are pre-populated with user data and include validation to prevent errors.

This setup ensures a seamless user experience while maintaining security and flexibility.
