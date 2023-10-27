# About this fullstack blog

This project was build by React.js, Firebase and Material-UI.

I built this blog as my hobby project for two reasons, first of all, it is a very good project for junior developers to practice full stack skills. Secondly, I really like blogs even thought it is a bit old school already, people read social media more than long articles. But I think blog is a good way to know the world slowly, peacefully and deeply.

## Scratch - before publish

When this web app was still running in my labtop locally, I used a very traditional way to build it: front end + backend server + database server. It was a very basic website with limited functions, like register, login, write new article, edit and delete. 

For the frontend, I use React + Material-UI, then I use Quill as the editor.

I wrote the backend service in Node.js: 
> **Express.js** - to control the routes
>> **multer** - middleware for the file upload;
>> 
>> **cookie-parser** - to parse http request cookies;
>> 
>> **jsonwebtoken** - for auth check;
>> 
>> **bcrypt** - to encrypt passwords;
>> 
>> **axios** - in the *client side* to communicate with backend;

The, I use MySQL as the database for users and blogs.

Everything was running locally, I had to start 3 local servers every time I want to test it. It was a very good practice for fullstack development, I learned the whole precess of both frontend and backend. How the data communicate from client to server to database. However, when I was ready to publish it, I realize I have to pay for so many services, and configure so many cloud servers, that was too much for a practice project.

That's why I was looking for some convenient cloud service to solve the prolem in a reasonable price, then I found firebase. It's like a convenient version of Google Cloud Platform, and if you have any advanced needs, you can easily merge GCP. It is basically free for beginners. So, i rewrote the backend part and move them to firebase completely.

## Version 0

I updated the backend services completely in this version which is the **main branch**. I use evrything from firebase, so the previous backend is completely gone.

> **firebase console** - for the cloud service control, so Express and axios are not needed anymore;
> 
>> **Firestore** - for database, it is an non-relational database, replacement of MySQL;
>> 
>> **Storage** - for file upload, replacement of multer;
>> 
>> **Authentication** - for user system and auth check, replacement of bcrypt and jsonwebtoken;

So now, I can easily host my website anywhere without worrying about the backend server.

## Version 1

Since I solved the annoying backend problems, I have more time to focus on the frontend. I was using Material-UI, because it is fast to use, I don't have to write too much css and I can easily have a modern looking webpage. But now I want to customized the style a bit more to match my portfolio site, also I want to increase the loading speed of my website. Then I realized it was not that convenient anymore. So I made a big update again, basically I remade the whole frontend using SCSS and got rid of Material-UI completely. (I still use some cute M-Ui components in my portfolio, but now in this blog).

So there is some big frontend changes:
> **Login** - Register page: the previous one was a bit boring, so I made a better one with more interactions and animations. That is not my original idea, I learned it from a very smart Youtuber(https://www.youtube.com/@OnlineTutorialsYT), he has lots of inspiring CSS ideas.
> 
> **Theme** - Now user can switch the theme from light mode to dark mode anytime anywhere, seamless. The default mode is dark, because I have a daaaaaark soul!!(just kidding). (Ok, when i am writing this file, I just found a theme change bug in the profile page, I will fix it soon)
> 
> **Editor** - In version 0, i was using Quill, because it is small and easy to use, also looks modern enough. But here I found a very annoying problem, Quill is not easy to customize. the default theme color is white, I want to change it to a certain dark blue to match my theme, but it is almost impossible to do, it has a super complicated structure with a looooong css file without documentation, I guess I am not supposed to customize the css file by myself. On top of that, Quill doesn't support React 18 that well. So I decided to change the editor. I tried many other editors, eventually, I found Tiptop. it is a very simple headless editor, very suitable  to make a minimalist editor for basic functions. And the customisation is very easy, basically nothing is pre-designed, so developers can customise everything easily. No need to check all the documentations to find the correct class name. Of course the cons are also obvious, no toolbar designed at all. So I simply made some buttons to achieve the toolbar. Only the “image from file” is a little bit annoying to make, because I need to upload the image to m firebase storage first, and return a download url, then give the url to editor, then editor displays the image to user.  The data control is very easy, I export the content from editor as json format to store in the database, then when I display the article, I convert the json data to html again. All those are the original method from Tiptop. So in general I highly recommend Tiptap as a lightweight, flexible and powerful editor.


## Next step

There are some bugs needed to be fixed, and some features I would want to add. 

> More responsive page - mobile UI
>
> Apply a more strict server side rule for the sake of data security
>
> Verify emails and reset password
>
> (Maybe) commenting
>
> More functions in editor toolbar (insert url, etc.)
