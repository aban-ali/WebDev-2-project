import { header_temp,books_body,foot } from "./components.js";
const taskbar={
    data(){
        return{
            is_searched:false,
            search_val:"",
            name_search:false,
            genre_search:false,
            show_table:false,
            join:false,
            // table content
            no_of_students:0,
            no_of_faculty:0,
            active_user:0,
            premium_user:0,
            genre_name:"",
            no_of_genre:0,
            total_books:0,
            most_popular_book:"",
            current_most_popular_book:"",
            books_on_hold:0
        }
    },
    template:`
<div>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <span class="navbar-brand" style="font-family: 'Brush Script MT', cursive;">Mistborn</span>
            <div class="collapse text-center navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <span @click="home" class="btn nav-link">Home</span>
                    </li>
                    <li class="nav-item">
                        <span @click="logout" class="nav-link btn">Log out</span>
                    </li>
                </ul>

                <div v-if="$root.is_premium" class="d-flex me-2">
                    <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                </div>
                <div v-else class="d-flex me-2">
                    <span @click="join=true" class="p-2 btn rounded-4 btn-outline-warning">
                        Become Premium Member
                    </span>
                </div>

                <div class="d-flex" role="search">
                    <input v-model="search_val" class="form-control me-2" type="search" placeholder="Search">
                    <button @click="search" class="btn btn-outline-success" type="submit">Search</button>
                </div>
            </div>
        </div>
    </nav>
    <div class="popup-form" v-if="this.join">
        <div class="overlay" @click="this.closeForm_member"></div>
        <div class="content">
        <span class="close-btn bg-danger rounded-3" @click="this.closeForm_member">&nbsp;&times;&nbsp;</span>
        <h2>Premium Subscription</h2>
            <ul>Benifits For Premium Members
                <li class="ms-4">Read in an ad-free environment</li>
                <li class="ms-4">Can hold upto 7 books</li>
                <li class="ms-4">Lorem ipsum dolor sit amet</li>
            </ul>
            <div>So why wait!! Become a member for $1 million now!</div>
            <div class="d-grid gap-2 my-3">
                <span @click="become_member" class="btn btn-outline-warning">Become a Member NOW</span>
            </div>
        </div>
    </div>
    <div v-if="is_searched">
        <div v-if="name_search[0]" class="m-3 row">
            <h3 class="text-success text-center">Searched Books</h3>
            <div v-for="book in name_search" class="card border-success m-2 p-0 col-4" style="max-width: 18rem;">
                <div class="card-header" style="background-color:#6ddd84;">Book</div>
                <div @click="go_to_book(book.name)" class="card-body btn text-success p-1">
                <h5 class="card-title">{{book.name}}</h5>
                <p class="card-text">
                    <ul>
                        Description : <span class="text-dark"> {{book.des}}</span>
                    </ul>
                    <ul>
                        Release Date : <span class="text-dark"> {{book.date.substring(0,17)}}</span>
                    </ul>
                </p>
                </div>
            </div>
            <hr class="border boder-5 border-success">
        </div>
        <div v-if="genre_search[0]" class="m-3 row">
            <h3 class="text-success text-center">Searched Genre</h3>
            <div v-for="book in genre_search" class="card border-success m-2 p-0 col-4" style="max-width: 18rem;">
                <div class="card-header" style="background-color:#6ddd84;">Book</div>
                <div @click="go_to_book(book.name)" class="card-body btn text-success p-1">
                <h5 class="card-title">{{book.name}}</h5>
                <p class="card-text">
                    <ul>
                        Description : <span class="text-dark"> {{book.des}}</span>
                    </ul>
                    <ul>
                        Release Date : <span class="text-dark"> {{book.date.substring(0,17)}}</span>
                    </ul>
                </p>
                </div>
            </div>
            <hr class="border boder-5 border-success">
        </div>
        <div v-if="no_search">
            <h3 class="text-danger text-center">Sorry!! <br> No result found</h3>
        </div>
    </div>
    <div>
    <div v-if="$root.role=='Admin'" class="d-grid gap-2">
        <button @click="show" class="btn btn-outline-success mx-5 my-2" type="button">Click here to see stats</button>
    </div>
    <table v-if="show_table" class="table table-success my-3 table-striped table-hover" style="width:80%; margin:auto;">
        <thead><tr><th>Quality</th><th>Value</th></tr></thead>
        <tbody><tr><td>Total number of books</td><td>{{total_books}}</td></tr>
        <tr><td>Most read book of all times</td><td>{{most_popular_book.name}}</td></tr>
        <tr><td>Current most popular book</td><td>{{current_most_popular_book.name}}</td></tr>
        <tr><td>Total number of books on hold by users</td><td>{{books_on_hold}}</td></tr>
        <tr><td>Total number of genres</td><td>{{no_of_genre}}</td></tr>
        <tr><td>Most like genre</td><td>{{genre_name.name}}</td></tr>
        <tr><td>Total number of users</td><td>{{no_of_students+no_of_faculty}}</td></tr>
        <tr><td>Total number of Student users</td><td>{{no_of_students}}</td></tr>
        <tr><td>Total number of Faculty users</td><td>{{no_of_faculty}}</td></tr>
        <tr><td>Total number of active users</td><td>{{active_user}}</td></tr>
        <tr><td>Number of members with premium subscription</td><td>{{premium_user}}</td></tr></tbody>
    </table>
    </div>
</div>`,
computed:{
    no_search:function(){
        if(!this.name_search[0] && !this.genre_search[0]){
            return true;
        }else{
            return false;
        }
    }
},
methods:{
    home:function(){
        if(books.role=="Admin"){
            window.location.href="/admin-dashboard";
        }else{
            window.location.href="/dashboard";
        }
    },
    show:function(){
        this.show_table=!this.show_table;
    },
    closeForm_member:function(){
        this.join=false
    },
    go_to_book:function(name){
        let url='/book/'+name;
        window.location.href=url
    },
    become_member:function(){
        let query=`mutation{
            user(user_name:"${book.user_name}",is_premium:true)
          }`
          console.log(query)
        const requestOption = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        };
        fetch('http://127.0.0.1:5000/graphql',requestOption).then(res=>res.json())
        .then(data=>{
            console.log(data)
        }).catch(err=>console.log("Graphql Error : ",err))
    },
    logout:function(){
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        };
        fetch('http://127.0.0.1:5000/logout', requestOptions).then(res=>res.json())
        .then(data=> { 
            if(!data.is_active){
                localStorage.removeItem("token")        
            if(books.role=="Admin"){window.location.href='/admin';}
            else{window.location.href='/'}}
        }).catch(err=> console.log(err));
    },
    search:function(){
        if(this.search_val){
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                }
            };
            let apiUrl="http://127.0.0.1:5000/search/book/"+this.search_val;
            fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data =>{
                this.name_search=data.by_name;
                this.genre_search=data.by_genre;
                this.is_searched=true;
            })
            .catch(error => {
                console.error('GraphQL Error:', error);
            });
        }else{
            this.is_searched=false;
        }
    }
    },
    mounted: async function(){
        let query=`{
            book{
                name,
                borrow_count,
                hold_count
            },
            user{
                role,
                is_active,
                is_premium
            },
            genres{
                name,
                count
            }
          }`
          const requestOption = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
            let apiUrl="http://127.0.0.1:5000/graphql";
            let books,users,genres
          await fetch(apiUrl, requestOption)
          .then(response => response.json())
          .then(data =>{
            books=data.data.book;
            users=data.data.user;
            genres=data.data.genres;
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });
          for( let user of users){
            console.log(user)
            if(user.role=='Student'){
                this.no_of_students+=1
            }
            else if(user.role=='Faculty'){
                this.no_of_faculty+=1
            }
            if(user.is_active){
                this.active_user+=1
            }
            if(user.is_premium){
                this.premium_user+=1
            }
          }
          this.genre_name=genres[0]
          this.no_of_genre=genres.length
          for(let gen of genres){
            if(gen.count>this.genre_name.count){
                this.genre_name=gen;
            }
          }
          this.total_books=books.length
          this.most_popular_book=books[0]
          this.current_most_popular_book=books[0]
          for(let book of books){
            this.books_on_hold+=book.hold_count
            if(this.most_popular_book.borrow_count<book.borrow_count){
                this.most_popular_book=book;
            }
            if(this.current_most_popular_book.hold_count<book.hold_count){
                this.current_most_popular_book=book.hold_count;
            }
          }
    }
}



const books=new Vue({
    el:"#app",
    data:{
        role:"",
        username:"",
        is_premium:false
    },
    template:`
    <div>
        <header-temp/>
        <taskbar/>
        <books-body/>
        <foot-er/>
    </div>`,
    components:{
        "header-temp":header_temp,
        "taskbar":taskbar,
        "books-body":books_body,
        "foot-er":foot
    },
    mounted:async function(){
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          await fetch('http://127.0.0.1:5000/validate', requestOptions).then(res=>res.json())
          .then(data=> { 
            if(!data.active_status){
            window.location.href='/error_page';
        }else{
            this.role=data.role;
            this.username=data.username;
        }
        }).catch(err=> console.log(err));
        let query=`{
            user(user_name:"${this.username}"){
                is_premium
            }
          }`
          const requestOption = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
            let apiUrl="http://127.0.0.1:5000/graphql";
          fetch(apiUrl, requestOption)
          .then(response => response.json())
          .then(data =>{
              this.is_premium=data.data.user[0].is_premium
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });





    }
})