<template>
  <div id="app">
      <div id="header">
            <div id="login-box">
                <div>
                    <img src="./assets/kt_ci2.png" width="40px" align="left"/>
                </div>
                <div id="login-menu">
                    <router-link v-if="!isLogged" to="Login"> 로그인 </router-link>
                    <span v-else>
                        <a>안녕하세요 {{getName}}님</a>
                        <a href="" @click="logOut"> 로그아웃 </a>
                    </span>
                </div>
            </div>
            <div class="header">
                <div class="container">
                    <div class="row">
                        <div class=" col-sm-8 col-xs-8 container">
                            <div id="navigation">
                                  <h1><router-link to="/">KT SW Developers Community</router-link></h1>
                            </div>
                        </div>
                        <div id="nav-menu" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <app-menu-navigation/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidebar-menu :menu="menu" :collapsed="collapsed" @item-click="onItemClick">
            <span slot="collapse-icon" v-if="collapsed">↔</span>
            <span slot="dropdown-icon">▶</span>
        </sidebar-menu>
        <router-view/>
        <div id="footer">
            <small>ⓒ Copyright 2019 developed by 권동현 All Rights Reserved</small>
        </div>
    </div>
</template>

<script>
// TODO : 디폴트로 접혀있게 하려면 어떻게 해야하지? -> 해결
import { SidebarMenu } from 'vue-sidebar-menu';
import customIcon from 'vue-icon/lib/vue-feather.esm'
export default {
  name: 'App',
  components: {
    SidebarMenu,
    customIcon
  },
  computed: {
        isLogged: function() {
            return this.$store.getters.isLogged
        },
        getId() {
            return this.$store.getters.getId
        },
        getName() {
            return this.$store.getters.getName
        }
    },
    watch: {
        
    },
    methods: {
        logOut: function() {
            this.$store.commit('logOut')
        },
       onItemClick(event, item) { // 여기서 분기해서 처리 가능
            //SidebarMenu.collapse(true); 페이지 바뀌면 메뉴가 접혔으면 좋겠는뎅
            if(item.title=='kt.com')
                window.open("http://www.kt.com","new page");
            else if(item.title=='recruit.kt.com')
                window.open("http://recruit.kt.com","new page");

       }
    },
    data(){
        return {
            baseClass: 'v-icon',
             menu: [ // TODO : 아이콘 바꾸자 -> 해결
                {
                    href: '/',
                    title: '홈',
                    icon: 'fa fa-home'
                },
                {
                    //href: '/',
                    title: '게시판',
                    icon: 'fa fa-newspaper',
                    child: [
                        {
                            href: '/',
                            title: '공지사항',
                            icon: 'fa fa-flag',
                        },
                        {
                            href: '/',
                            title: '자유게시판',
                            icon: 'fa fa-user',
                        },
                        {
                            href: '/',
                            title: 'Q&A',
                            icon: 'fa fa-question-circle',
                        },
                        {
                            href: '/',
                            title: '지식 공유',
                            icon: 'fa fa-exclamation',
                        }
                    ]
                },
                {
                    //href: '/',
                    title: '채팅',
                    icon: 'fa fa-comments',
                    child: [
                        {
                            href: '/',
                            title: '자유채팅',
                            icon: 'fa fa-user',
                        },
                        {
                            href: '/',
                            title: 'Q&A',
                            icon: 'fa fa-question-circle',
                        }
                    ]
                },
                {
                    href: '/codelist',
                    title: '코드 리뷰',
                    icon: 'fa fa-code',
                },
                {
                    //href: '/',
                    title: '사이트맵',
                    icon: 'fa fa-map',
                    child: [ // TODO : 링크가 안걸려 -> 해결
                        {
                            //href: 'http://www.kt.com',
                            title: 'kt.com',
                            icon: 'fa fa-hashtag',
                        },
                        {
                            //href: 'http://www.kt.com',
                            title: 'recruit.kt.com',
                            icon: 'fa fa-hashtag',
                        },
                    ]
                },
            ],
            collapsed: true
        }
    }
}
</script>

<style>
@import './assets/noty.css';
@import '../node_modules/vue-wysiwyg/dist/vueWysiwyg.css';

@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
@font-face {
  font-family: 'NanumGothic' ;
  src:url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.eot);
  src:url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.eot?#iefix) format('embedded-opentype'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.woff2) format('woff2'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.woff) format('woff'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf) format('truetype');
  font-weight : normal;
  font-style : normal;
}
@font-face {
    font-family: 'Olleh';
    src:url('assets/Droid-Sans-Fallback.ttf') format('truetype');
    font-weight : normal;
    font-style : normal;
}
div {
 font-family: 'Olleh','NanumGothic';
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style scoped>
@media (min-width: 999px){
    #nav-menu {
        display: inline-block;
    }
}

@media (max-width: 1000px){
    #nav-menu {
        display: none;
    }
}
#login-box {
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 30px;
    background-color: #BBDEFB;
}
#login-menu {
    float: right;
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 15px;
    display: relative;
    color: black;
    z-index: 10;
}
a {
    margin-left: 5px;
}
#login-menu a {
    color: black;
}

#main-menu {
    background: white;
}

#main-menu a {
    box-sizing: border-box;
    width: 110px;
    color: black;
    background: white;
}
.header {
    background-color: #fff;
    z-index: 99;
    position: relative;
    padding-top: 50px;
    padding-bottom: 20px;
}
#footer {
    margin-top: 400px;
    padding: 10px;
    position: relative;
    background: rgb(220, 220, 220);
    color: black;
}
.v-sidebar-menu .vsm-arrow:after {
    content: '\f105';
    font-family: 'Font Awesome 5 Free';
}

.v-sidebar-menu .collapse-btn:after {
    content: '\f337';
    font-family: 'Font Awesome 5 Free';
}
.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: '\f105';
  font-family: 'FontAwesome';
}

.sidebar.v-sidebar-menu .collapse-btn:after {
  content: '\f07e';
  font-family: 'FontAwesome';
}
</style>
