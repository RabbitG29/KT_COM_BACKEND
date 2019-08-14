<template>
  <div>
    <div
      class="row my_nav_bar"
      style="height: 8vh; top: 0; position: fixed; width: 100%"
    >
      <div class="col-md-2" align="center" style="">
        <button class="my_DandiSS" @click="$router.push({ name: 'Home' })">
          DandiSS
        </button>
      </div>
      <div class="col-md-1" align="center">
        <button class="my_nav_link" @click="$router.push({ name: 'Public' })">
          Public
        </button>
      </div>
      <div class="col-md-1" align="center">
        <button class="my_nav_link" @click="$router.push({ name: 'Private' })">
          Private
        </button>
      </div>
      <div class="col-md-1" align="center">
        <button
          class="my_nav_link"
          @click="$router.push({ name: 'Suggestion' })"
        >
          Suggestion
        </button>
      </div>
      <div class="col-md-4"></div>
      <div class="col-md-1" align="center">
        <button class="my_nav_link" v-if="isLogin" @click="logout">
          Logout
        </button>
        <button class="my_nav_link" v-else-if="isAuth" @click="logout">
          Logout
        </button>
        <button
          class="my_nav_link"
          v-else
          @click="$router.push({ name: 'Login' })"
        >
          Login
        </button>
      </div>
      <div class="col-md-1" align="center">
        <div
          class="dropdown my_nav_link"
          align="center"
          style="text-align: center"
        >
          <button class="dropbtn" style="vertical-align: center;">
            Others
          </button>
          <div class="dropdown-content">
            <a href="https://gitlab.com/gitlab-org" target="_blank"
              ><img
                src="../assets/gitlab-logo-gray-rgb.png"
                style="width: 80px;"
            /></a>
            <a href="https://gitlab.com/gitlab-org" target="_blank"
              ><img src="../assets/trello-logo-blue.png" style="width: 80px;"
            /></a>
          </div>
        </div>
      </div>
      <div class="col-md-1" style="background-color: white"></div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <transition name="fade">
          <div
            v-if="isCategoryClicked"
            class="sidebar"
            style="background-color: whitesmoke; "
          >
            <div
              id="category-btn"
              align="center"
              style="text-align:center; margin-top: 10px"
            >
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-if="categoryName === 'DataBase'"
                style="background-color: white; padding-left: 20px; font-size: 25px"
                @click="change_category('DataBase')"
              >
                DataBase
              </div>
              <div
                id="my_category_btn"
                align="center"
                class="row"
                v-else
                @click="change_category('DataBase')"
                style="text-align: center; padding-left: 20px; font-size: 25px"
              >
                DataBase
              </div>
            </div>
            <div id="category-btn" align="center" style="margin-top: 10px; ">
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-if="categoryName === 'Server'"
                style="background-color: white; padding-left: 20px; font-size: 25px"
                @click="change_category('Server')"
              >
                Server
              </div>
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-else
                @click="change_category('Server')"
                style="padding-left: 20px; font-size: 25px"
              >
                Server
              </div>
            </div>
            <div id="category-btn" align="center" style="margin-top: 10px">
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-if="categoryName === 'Tool'"
                style="background-color: white; padding-left: 20px; font-size: 25px"
                @click="change_category('Tool')"
              >
                Tool
              </div>
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-else
                @click="change_category('Tool')"
                style=" padding-left: 20px; font-size: 25px"
              >
                Tool
              </div>
            </div>
            <div id="category-btn" align="center" style="margin-top: 10px">
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-if="categoryName === 'Language'"
                style="background-color: white; padding-left: 20px; font-size: 25px"
                @click="change_category('Language')"
              >
                Language
              </div>
              <div
                id="my_category_btn"
                class="row"
                align="center"
                v-else
                @click="change_category('Language')"
                style="padding-left: 20px; font-size: 25px"
              >
                Language
              </div>
            </div>
            <hr />

            <div class="row" style=" margin-bottom: 1px">
              <div class="col-md-1"></div>
              <div class="col-md-10">
                <b-form-input
                  style="text-align: center; font-size: 11px;"
                  @input="board_search(search_word)"
                  v-model="search_word"
                  placeholder="검색어를 입력하세요."
                ></b-form-input>
              </div>
              <div class="col-md-1"></div>
            </div>
            <div align="center">
              <b-btn
                variant="primary"
                @click="search_init"
                style="font-size:12px"
                >검색 초기화</b-btn
              >
            </div>
            <div class="row" style="margin-top: 50px">
              <div class="col-md-1"></div>
              <div @click="PublicFilterLove" class="col-md-5">
                <b-btn id="filter-btn" variant="warning" style="font-size:12px"
                  >좋아요 순</b-btn
                >
              </div>
              <div @click="PublicFilterTime" class="col-md-5">
                <b-btn id="filter-btn" variant="danger" style="font-size:12px"
                  >최신 순</b-btn
                >
              </div>
              <div class="col-md-1"></div>
            </div>
            <div @click="goWritePage">
              <div class=" col-md-5"></div>
              <a>
                <button
                  style="font-size: 20px; font-weight: bold; font-family: 'Franklin Gothic Heavy'"
                >
                  글을 쓰시려면 클릭하세요!
                </button></a
              >
            </div>
          </div>
        </transition>
      </div>
      <div
        v-if="isCategoryClicked"
        class="col-md-10"
        style="height: 92vh; top: 8vh; bottom: 0"
      >
        <div class="row">
          <v-layout
            id="myCardList"
            justify-center
            class="col-3"
            style="margin-top:40px; margin: 20px; padding:1px; border: 1px black"
            v-for="(item, i) in boards"
            @click="click_board(item)"
            :key="i"
          >
            <div>
              <div
                align="left"
                style="min-height:50px; margin-top: 10px; width: 200px; font-weight:bold; font-size:18px; font-family:'Open Sans'; "
              >
                {{ item.title }}
              </div>

              <div style="font-size: 11px; margin-top: 30px">
                <span style="padding: 0px" class="col-md-4">
                  <button @click="click_emotion(item, 'love')">
                    Great
                  </button>
                  {{ item.love }}개
                </span>
                <span class="col-md-1"></span>
                <span style="padding: 0px" class="col-md-4">
                  <button @click="click_emotion(item, 'like')">
                    Good
                  </button>
                  {{ item.like }}개
                </span>
                <span class="col-md-1"></span>
                <span style="padding: 0px" class="col-md-4">
                  <button @click="click_emotion(item, 'hate')">
                    Bad
                  </button>
                  {{ item.hate }}개
                </span>
              </div>
              <div style="margin: 10px">
                <img width="50px" :src="item.Users[0].imgUrl" />
                <span style="margin-left: 10px">by {{ item.Users[0].id }}</span>
              </div>
              <div
                style="margin: 10px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"
              >
                {{ item.whenCreated }}
              </div>
            </div>
          </v-layout>
        </div>
      </div>
      <div
        align="center"
        v-else
        style="position: absolute; top: 30vh; left: 30vh; right:30vh"
      >
        <v-layout justify-center style="top: 70vh">
          <v-layout @click="change_category('DataBase')">
            <cardv
              style="text-align: left"
              data-image="https://images.unsplash.com/photo-1479660656269-197ebb83b540?dpr=2&auto=compress,format&fit=crop&w=1199&h=798&q=80&cs=tinysrgb&crop="
            >
              <h1 slot="header">DataBase</h1>
              <p slot="content">
                게시글을 보시려면 클릭하세요!
              </p>
            </cardv>
          </v-layout>

          <v-layout justify-center @click="change_category('Server')">
            <cardv
              style="text-align: left"
              data-image="https://images.unsplash.com/photo-1479659929431-4342107adfc1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop="
            >
              <h1 slot="header">Server</h1>
              <p slot="content">
                게시글을 보시려면 클릭하세요!
              </p>
            </cardv>
          </v-layout>
          <v-layout
            style="text-align: left"
            justify-center
            @click="change_category('Language')"
          >
            <cardv
              data-image="https://images.unsplash.com/photo-1479644025832-60dabb8be2a1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop="
            >
              <h1 slot="header">Language</h1>
              <p slot="content">
                게시글을 보시려면 클릭하세요!
              </p>
            </cardv>
          </v-layout>
          <v-layout
            style="text-align: left"
            justify-center
            @click="change_category('Tool')"
          >
            <cardv
              data-image="https://images.unsplash.com/photo-1479621051492-5a6f9bd9e51a?dpr=2&auto=compress,format&fit=crop&w=1199&h=811&q=80&cs=tinysrgb&crop="
            >
              <h1 slot="header">Tool</h1>
              <p slot="content">
                게시글을 보시려면 클릭하세요!
              </p>
            </cardv>
          </v-layout>
        </v-layout>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">감정 표현 오류</v-card-title>
        <v-card-text>
          이미 해당 게시물에 감정 표현을 하셨습니다. 감정을 확인해주세요!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            네!!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import store from "../store"
import { mapState, mapActions } from "vuex"
import Cardv from "./Card"
import router from "../router"

export default {
  data() {
    return {
      boards: null,
      emotion: null,
      categoryName: null,
      dialog: false,
      isCategoryClicked: false,
      search_word: null,
      search_result: []
    }
  },
  created() {
    this.$bvToast.toast(`전체 게시물을 볼 수 있는 페이지입니다.`, {
      title: "Public?",
      autoHideDelay: 5000,
      appendToast: true
    })
  },
  components: {
    Cardv
  },
  computed: {
    ...mapState(["isLogin", "isAuth"])
  },
  watch: {
    boards: function() {
      axios
        .get("http://13.124.9.179:4000/api/public/changeCategory", {
          params: {
            categoryName: this.categoryName,
            userUid: store.state.userInfo.userUid
          }
        })
        .then(result => {
          return result.data
        })
    }
  },
  methods: {
    ...mapActions(["logout", "click_board"]),
    // 카테고리 클릭시 이벤트
    change_category(name) {
      this.isCategoryClicked = true
      this.categoryName = name
      //axios get
      axios
        .get("http://13.124.9.179:4000/api/public/boardInfo", {
          params: {
            categoryName: name,
            userUid: store.state.userInfo.userUid
          }
        })
        .then(result => {
          this.boards = result.data
          for (const i in this.boards) {
            this.boards[i].whenCreated = this.$tz.utcTolocal(
              this.boards[i].whenCreated,
              "YYYY년 MM월 DD일"
            )
          }
        })
    },
    search_init() {
      this.search_word = ""
      this.search_result = this.boards
      axios
        .get("http://13.124.9.179:4000/api/public/boardInfo", {
          params: {
            categoryName: this.categoryName,
            userUid: store.state.userInfo.userUid
          }
        })
        .then(result => {
          this.boards = result.data
          for (const i in this.boards) {
            this.boards[i].whenCreated = this.$tz.utcTolocal(
              this.boards[i].whenCreated,
              "YYYY년 MM월 DD일"
            )
          }
        })
    },
    board_search(word) {
      if (!this.search_word) {
        axios
          .get("http://13.124.9.179:4000/api/public/boardInfo", {
            params: {
              categoryName: this.categoryName,
              userUid: store.state.userInfo.userUid
            }
          })
          .then(result => {
            this.boards = result.data
            for (const i in this.boards) {
              this.boards[i].whenCreated = this.$tz.utcTolocal(
                this.boards[i].whenCreated,
                "YYYY년 MM월 DD일"
              )
            }
          })
      }
      this.search_result = []
      for (let i = 0; i < this.boards.length; i++) {
        var scannerIndex = this.boards[i].title.indexOf(word)
        if (scannerIndex !== -1) {
          this.search_result.push(this.boards[i])
        }
        if (i === this.boards.length - 1) {
          this.boards = this.search_result
        }
      }
    },
    async click_emotion(item, emotion) {
      event.stopPropagation()
      await axios
        .post("http://13.124.9.179:4000/api/public/boardEmotion", {
          userUid: store.state.userInfo.userUid,
          boardUid: item.boardUid,
          emotion: emotion
        })
        .then(res => {
          if (res.data.msg === "success") {
            axios
              .get("http://13.124.9.179:4000/api/public/boardInfo", {
                params: {
                  categoryName: this.categoryName,
                  userUid: this.$store.state.userInfo.userUid
                }
              })
              .then(result => {
                this.boards = result.data
                for (const i in this.boards) {
                  this.boards[i].whenCreated = this.$tz.utcTolocal(
                    this.boards[i].whenCreated,
                    "YYYY년 MM월 DD일"
                  )
                }
              })
          } else {
            this.dialog = true
          }
        })
    },
    PublicFilterLove() {
      axios
        .post("http://13.124.9.179:4000/api/public/filterLove", {
          categoryName: this.categoryName,
          userUid: this.$store.state.userInfo.userUid
        })
        .then(res => {
          this.boards = res.data
          for (const i in this.boards) {
            this.boards[i].whenCreated = this.$tz.utcTolocal(
              this.boards[i].whenCreated,
              "YYYY년 MM월 DD일"
            )
          }
        })
    },
    PublicFilterTime() {
      axios
        .post("http://13.124.9.179:4000/api/public/filterTime", {
          categoryName: this.categoryName,
          userUid: this.$store.state.userInfo.userUid
        })
        .then(res => {
          this.boards = res.data
          for (const i in this.boards) {
            this.boards[i].whenCreated = this.$tz.utcTolocal(
              this.boards[i].whenCreated,
              "YYYY년 MM월 DD일"
            )
          }
        })
    },
    goWritePage() {
      router.push({ name: "Writing" })
    }
  }
}
</script>
<style>
.sidebar {
  width: 250px;
  height: 92vh;
  position: fixed;
  left: 0;
  background-color: #111;
  transition: 0.5s;
  text-align: center;
  color: black;
  overflow: hidden;
}
</style>
<style>
.cards-wrapper {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 4rem;
  /*margin: 0 auto;*/
  width: max-content;
}

.boardList {
  --bg-filter-opacity: 0.5;
  height: 11em;
  width: 13em;
  font-size: 22px;
  color: white;
  border-radius: 1em;
  padding: 5px;
  margin: 1em;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background: linear-gradient(
      rgba(0, 0, 0, var(--bg-filter-opacity)),
      rgba(0, 0, 0, var(--bg-filter-opacity))
    ),
    var(--bg-img) center;
  box-shadow: 0 0 0.1em 0.1em black;
  transition: all, var(--transition-time);
  position: relative;
  overflow: hidden;
  border: 10px solid #ccc;
  text-decoration: none;
}

.boardList:hover {
  transform: rotate(0);
}

.boardList h1 {
  margin: 0;
  font-size: 1.5em;
  line-height: 1.2em;
}

.boardList p {
  font-size: 0.75em;
  font-family: "Open Sans";
  margin-top: 0.5em;
  line-height: 2em;
}

.boardList .tags {
  display: flex;
}

.boardList .tags .tag {
  font-size: 0.75em;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.3rem;
  padding: 0 0.5em;
  margin-right: 0.5em;
  line-height: 1.5em;
  transition: all, var(--transition-time);
}

.boardList:hover .tags .tag {
  background: var(--color);
  color: white;
}

.boardList .date {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.75em;
  padding: 1em;
  line-height: 1em;
  opacity: 0.8;
}

.boardList:before,
.boardList:after {
  content: "";
  transform: scale(0);
  transform-origin: top left;
  border-radius: 50%;
  position: absolute;
  left: -50%;
  top: -50%;
  z-index: -5;
  transition: all, var(--transition-time);
  transition-timing-function: ease-in-out;
}

.boardList:before {
  background: #ddd;
  width: 250%;
  height: 250%;
}

.boardList:after {
  background: white;
  width: 200%;
  height: 200%;
}

.boardList:hover {
  color: var(--color);
}

.boardList:hover:before {
  transform: scale(1);
}

.card-grid-space .num {
  font-size: 3em;
  margin-bottom: 1.2rem;
  margin-left: 1rem;
}

.info {
  font-size: 1.2em;
  display: flex;
  padding: 1em 3em;
  height: 3em;
}

.info img {
  height: 3em;
  margin-right: 0.5em;
}

.info h1 {
  font-size: 1em;
  font-weight: normal;
}

.card-grid-space .num {
  /margin-left: 0;
  /text-align: center;
}

/*프로필 이미지*/
.profile-image {
  border-radius: 70px;
  -moz-border-radius: 70px;
  -khtml-border-radius: 70px;
  -webkit-border-radius: 70px;
  width: 70px;
  height: 70px;
}
</style>
<style>
.my_nav_bar {
  letter-spacing: 0.1px;
  background-color: white;
  padding: 0px;
  width: 100%;
  z-index: 11;
}
.my_DandiSS {
  color: navajowhite;
  font-size: 22px;
  font-weight: 600;
  z-index: 11;
}
.my_nav_link {
  color: black;
  font-size: 26px;
  font-weight: 400;
  z-index: 11;
  width: 100%;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  border-radius: 7px;
  -moz-border-radius: 7px;
  -khtml-border-radius: 7px;
  -webkit-border-radius: 7px;
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: darkturquoise;
  padding: 3px 4px;
  text-decoration: none;
  display: block;
  text-align: center;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.login_btn {
  padding: 10px 20px;
  color: white;
  background-color: initial;
  border: unset;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.login_btn:hover {
  padding: 10px 20px;
  color: black;
  background-color: beige;
  border: unset;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
<style>
.sidebar {
  height: 92vh;
  bottom: 0;
  left: 0;
  background-color: #111;
  -webkit-transition: 1.25s;
  transition: 2.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
}
.fade-leave {
  /* opacity: 1; */
}
.fade-leave-active {
  transition: opacity 1s;
  opacity: 0;
}
.sidebar #category-btn:hover {
  background-color: white;
}

.sidebar #filter-btn:hover {
  box-shadow: 0px 5px 4px 0px rgba(0, 0, 0, 0.2);
}
.category_btn_clicked {
  background-color: white;
}
</style>
<style>
#my_category_btn:hover {
  font-weight: bold;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 2s;
}
.fade-leave {
  /* opacity: 1; */
}
.fade-leave-active {
  transition: opacity 2s;
  opacity: 0;
}
</style>
<style>
#myCardList {
  border-radius: 20px;
  -moz-border-radius: 20px;
  -khtml-border-radius: 20px;
  -webkit-border-radius: 20px;
  box-shadow: 1px 4px 4px 2px lightgray;
}
</style>
