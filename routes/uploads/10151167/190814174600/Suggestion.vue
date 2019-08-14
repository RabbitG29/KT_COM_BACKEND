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
      <div
        class="col-md-2"
        style="background-color: whitesmoke;margin-left: 10px"
      >
        <transition name="fade">
          <div class="sidebar">
            <div class="row" style=" margin-bottom: 1px">
              <div class="col-md-1"></div>
              <div class="col-md-10">
                <b-form-input
                  style="margin-right: 20px;text-align: center"
                  @input="suggestion_search(search_word)"
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
            <div
              align="center"
              style="margin-top: 100px"
              v-b-modal.modal-center
            >
              <a>
                <button
                  style="font-size: 22px; font-weight: bold; font-family: 'Franklin Gothic Heavy'"
                >
                  건의하기 !
                </button></a
              >
            </div>
          </div>
        </transition>
      </div>
      <div class="col-md-9">
        <v-layout justify-center style="margin:80px;">
          <table
            class="table mystyletable"
            :current-page="currentPage"
            :per-page="perPage"
          >
            <thead>
              <tr style="padding: 8px">
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th
                  style="text-align: center"
                  v-if="$store.state.userInfo.userUid === 1"
                >
                  관리자 권한
                </th>
                <th style="text-align: center">
                  공개 여부
                </th>
                <th style="text-align: center;">관리</th>
              </tr>
            </thead>
            <tbody :key="i" v-for="(item, i) in items">
              <tr
                style="margin: 5px; background-color: white"
                @click="toggle(item)"
                v-b-toggle="'item.suggestionUid'"
              >
                <td style=" padding:12px">
                  {{ i + 1 }}
                </td>
                <td style=" padding-right:6px; font-weight: bold">
                  {{ item.title }}
                </td>
                <td style="font-weight: bold">
                  {{ item.User.id }}
                </td>
                <td>
                  {{ item.status === 1 ? "완료" : "진행중" }}
                </td>
                <td
                  style="text-align: center"
                  v-if="$store.state.userInfo.userUid === 1"
                >
                  <button
                    v-if="
                      $store.state.userInfo.userUid === 1 && item.status === 0
                    "
                    @click="handleComplete(item)"
                    style="padding:7px; background-color: yellowgreen; color:white;border-radius: 7px;
                            -moz-border-radius: 7px;
                            -khtml-border-radius: 7px;
                            -webkit-border-radius: 7px;"
                  >
                    완료
                  </button>
                </td>
                <td style="text-align: center">
                  {{ item.isPrivate === 0 ? "공개" : "비공개" }}
                </td>
                <td style="text-align: center">
                  <button
                    v-if="
                      (!suggestionUpdateCompleteBtnAndCancelBtnToggle &&
                        item.User.userUid === $store.state.userInfo.userUid) ||
                        (selected !== item.suggestionUid &&
                          item.User.userUid === $store.state.userInfo.userUid)
                    "
                    @click="UpdateSuggestion(item)"
                    style="margin-right:5px; padding:7px; background-color: deepskyblue;border-radius: 7px;
                            -moz-border-radius: 7px;
                            -khtml-border-radius: 7px;
                            -webkit-border-radius: 7px;"
                  >
                    수정
                  </button>
                  <button
                    v-if="
                      suggestionUpdateCompleteBtnAndCancelBtnToggle &&
                        item.User.userUid === $store.state.userInfo.userUid &&
                        selected === item.suggestionUid
                    "
                    style="margin-right:5px; padding:7px; background-color: deepskyblue;border-radius: 7px;
                            -moz-border-radius: 7px;
                            -khtml-border-radius: 7px;
                            -webkit-border-radius: 7px;"
                    @click="CancelBtn(item)"
                  >
                    취소
                  </button>
                  <button
                    v-if="
                      suggestionUpdateCompleteBtnAndCancelBtnToggle &&
                        item.User.userUid === $store.state.userInfo.userUid &&
                        selected === item.suggestionUid
                    "
                    style="margin-right:5px; padding:7px; background-color: deepskyblue;border-radius: 7px;
                            -moz-border-radius: 7px;
                            -khtml-border-radius: 7px;
                            -webkit-border-radius: 7px;"
                    @click="CompleteBtn(item)"
                  >
                    수정 완료
                  </button>
                  <button
                    @click="DeleteSuggestion(item)"
                    v-if="item.User.userUid === $store.state.userInfo.userUid"
                    style="padding:7px; background-color: darkgrey;border-radius: 7px;
                            -moz-border-radius: 7px;
                            -khtml-border-radius: 7px;
                            -webkit-border-radius: 7px;"
                  >
                    삭제
                  </button>
                </td>
              </tr>
              <tr>
                <td style="padding: 0" colspan="6">
                  <b-collapse
                    :id="'item.suggestionUid'"
                    v-if="
                      selected === item.suggestionUid &&
                        (item.isPrivate === 0 ||
                          (item.isPrivate === 1 &&
                            selectedUserUid === $store.state.userInfo.userUid))
                    "
                  >
                    <div
                      v-if="!suggestionUpdateCompleteBtnAndCancelBtnToggle"
                      style="padding: 10px;height: 40px; margin: 30px;background-color: navajowhite; background-color: white;   border-radius: 20px;
  -moz-border-radius: 20px;
  -khtml-border-radius: 20px;
  -webkit-border-radius: 20px;
  box-shadow: 1px 4px 4px 2px lightgray;"
                    >
                      {{ item.content }}
                    </div>
                    <div v-if="suggestionUpdateCompleteBtnAndCancelBtnToggle">
                      <b-textarea
                        style="padding: 10px;height: 40px; margin: 30px;background-color: navajowhite; background-color: white;   border-radius: 20px;
  -moz-border-radius: 20px;
  -khtml-border-radius: 20px;
  -webkit-border-radius: 20px;
  box-shadow: 1px 4px 4px 2px lightgray;"
                        v-model="suggstionUpdateContent"
                        autofocus
                      >
                      </b-textarea>
                    </div>
                  </b-collapse>
                </td>
              </tr>
            </tbody>
          </table>
        </v-layout>
      </div>
    </div>

    <v-layout ml-10 justify-start>
      <b-modal
        id="modal-center"
        centered
        ref="modal"
        title="건의사항 접수"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <v-text-field
          style="margin-top: 20px"
          height="50px"
          name="input-7-1"
          label="제목을 입력하세요"
          v-model="suggest_title"
        ></v-text-field>
        <v-textarea
          name="input-7-1"
          label="내용을 입력하세요"
          v-model="suggest_content"
        ></v-textarea>
        <v-overflow-btn
          style="margin-left:20px; padding:5px; max-width: 200px; "
          v-model="isPrivate"
          :items="options"
          label="공개범위 설정"
          overflow
        ></v-overflow-btn>
      </b-modal>
      <b-modal
        :id="infoModal.id"
        :title="infoModal.title"
        ok-only
        @hide="resetInfoModal"
      >
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios"
import store from "../store"
import { mapState, mapActions } from "vuex"

export default {
  data() {
    return {
      suggstionUpdateToggle: true,
      suggstionUpdateContent: "",
      suggestionUpdateCompleteBtnAndCancelBtnToggle: false,
      items: null,
      suggest_title: null,
      suggest_content: null,
      fields: [
        {
          key: "title",
          label: "Title",
          class: "text-center"
        },
        { key: "User", label: "User" },
        { key: "actions", label: "Actions" },
        { key: "status", label: "Status" }
      ],
      search_result: null,
      selected: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: null,
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      search_word: null,
      isPrivate: null,
      options: [{ text: "공개", value: 0 }, { text: "비공개", value: 1 }]
    }
  },
  created: function() {
    axios
      .get("http://13.124.9.179:4000/api/suggestion/info", {
        params: {
          userUid: store.state.userInfo.userUid
        }
      })
      .then(res => {
        this.items = res.data
        this.totalRows = this.items.length
      })
    this.search_init()
    this.$bvToast.toast(
      `블로그에 대해 건의하고 싶은 내용을 자유롭게 작성하는 페이지입니다.`,
      {
        title: "Suggestion?",
        autoHideDelay: 5000,
        appendToast: true
      }
    )
  },
  computed: {
    ...mapState(["isLogin", "isAuth"])
  },
  methods: {
    ...mapActions(["logout"]),

    resetInfoModal() {
      this.infoModal.title = ""
      this.infoModal.content = ""
    },
    resetModal() {
      this.suggest_title = ""
      this.suggest_content = ""
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    CancelBtn() {
      event.stopPropagation()
      this.suggestionUpdateCompleteBtnAndCancelBtnToggle = false
    },
    CompleteBtn(item) {
      event.stopPropagation()
      this.suggestionUpdateCompleteBtnAndCancelBtnToggle = false

      axios
        .post("http://13.124.9.179:4000/api/suggestion/update", {
          suggestionUid: item.suggestionUid,
          content: this.suggstionUpdateContent
        })
        .then(result => {
          if (result.status === 200) {
            this.$bvModal.msgBoxOk("수정완료 되었습니다.", {
              size: "sm",
              buttonSize: "sm",
              okVariant: "success",
              headerClass: "p-2 border-bottom-1",
              footerClass: "p-2 border-top-1",
              centered: true
            })
            axios
              .get("http://13.124.9.179:4000/api/suggestion/info", {
                params: {
                  userUid: store.state.userInfo.userUid
                }
              })
              .then(res => {
                this.items = res.data
                this.totalRows = this.items.length
              })
          }
        })
      //완료처리
    },
    UpdateSuggestion(item) {
      this.suggestionUpdateCompleteBtnAndCancelBtnToggle = true
      this.suggstionUpdateContent = item.content
    },
    DeleteSuggestion(item) {
      event.stopPropagation()
      this.$bvModal
        .msgBoxConfirm("삭제 하시겠습니까?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            axios
              .delete("http://13.124.9.179:4000/api/suggestion/delete", {
                params: {
                  suggestionUid: item.suggestionUid
                }
              })
              .then(result => {
                if (result.status === 200) {
                  this.$bvModal.msgBoxOk("삭제 되었습니다.", {
                    size: "sm",
                    buttonSize: "sm",
                    okVariant: "success",
                    headerClass: "p-2 border-bottom-1",
                    footerClass: "p-2 border-top-1",
                    centered: true
                  })
                  axios
                    .get("http://13.124.9.179:4000/api/suggestion/info", {
                      params: {
                        userUid: store.state.userInfo.userUid
                      }
                    })
                    .then(res => {
                      this.items = res.data
                      this.totalRows = this.items.length
                    })
                }
              })
          }
        })
      console.log(item)
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      axios
        .post("http://13.124.9.179:4000/api/suggestion/create", {
          suggestion: {
            userUid: store.state.userInfo.userUid,
            title: this.suggest_title,
            content: this.suggest_content,
            isPrivate: this.isPrivate
          }
        })
        .then(result => {
          if (result.status === 200) {
            this.isPrivate = 0
            axios
              .get("http://13.124.9.179:4000/api/suggestion/info")
              .then(res => {
                this.items = res.data
                this.totalRows = this.items.length
                this.$nextTick(() => {
                  this.$refs.modal.hide()
                })
              })
            this.$bvToast.toast(`건의사항이 접수되었습니다.`, {
              title: "건의사항 접수 완료 메시지",
              autoHideDelay: 5000,
              appendToast: true
            })
          }
        })
    },
    handleComplete(item) {
      event.stopPropagation()
      axios
        .get("http://13.124.9.179:4000/api/suggestion/complete", {
          params: {
            suggestionUid: item.suggestionUid
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$bvModal.msgBoxOk("완료처리 되었습니다.", {
              size: "sm",
              buttonSize: "sm",
              okVariant: "success",
              headerClass: "p-2 border-bottom-1",
              footerClass: "p-2 border-top-1",
              centered: true
            })
            axios
              .get("http://13.124.9.179:4000/api/suggestion/info")
              .then(res => {
                this.items = res.data
                this.totalRows = this.items.length
                this.$nextTick(() => {
                  this.$refs.modal.hide()
                })
              })
          }
        })
    },
    toggle(item) {
      this.selected = item.suggestionUid
      this.selectedUserUid = item.User.userUid
    },

    suggestion_search(word) {
      if (!this.search_word) {
        axios.get("http://13.124.9.179:4000/api/suggestion/info").then(res => {
          this.items = res.data
          this.totalRows = this.items.length
        })
      }
      this.search_result = []
      for (let i = 0; i < this.items.length; i++) {
        var scannerIndex = this.items[i].title.indexOf(word)
        if (scannerIndex !== -1) {
          this.search_result.push(this.items[i])
        }
        if (i === this.items.length - 1) {
          this.items = this.search_result
        }
      }
    },
    search_init() {
      this.search_result = this.items
    }
  }
}
</script>
<style scoped>
header.masthead {
  padding: 50px 0 150px;
  color: white;
  text-align: center;
  background: url("../assets/home-back2.jpg") no-repeat center;
  background-size: cover;
}
#mainNav {
  position: absolute;
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.nav-link {
  color: navajowhite;
  font-size: 22px;
  font-weight: 800;
}
#mainNav .navbar-nav > li.nav-item > a {
  padding: 10px 20px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
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
.navbar {
  position: fixed;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}
.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
}

#mainNav.is-fixed .navbar-nav > li.nav-item > a {
  color: #ffffff;
}

#mainNav .navbar-nav > li.nav-item > a:hover {
  color: black;
  background-color: beige;
}
</style>
<style>
.mybtn {
  color: blue;
}
</style>
<style>
.button-4 {
  width: 500px;
  height: 50px;
  border: 2px solid #34495e;
  text-align: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 20px;
}
.button-4 a {
  font-family: arial;
  font-size: 16px;
  color: #34495e;
  text-decoration: none;
  line-height: 50px;
  transition: all 0.5s ease;
  z-index: 2;
  position: relative;
}
.eff-4 {
  width: 500px;
  height: 50px;
  left: -500px;
  background: darkgreen;
  position: absolute;
  transition: all 0.5s ease;
  z-index: 1;
}
.button-4:hover .eff-4 {
  left: 0;
}
.button-4:hover a button {
  color: #fff;
}
</style>
<style>
.mystyletable thead {
  border-top: 0px solid whitesmoke;
  border-bottom: 3px solid black;
}
</style>
<style>
.my_nav_bar {
  letter-spacing: 0.1px;
  background-color: white;
  padding: 0px;
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
  background-color: whitesmoke;
  -webkit-transition: 1.25s;
  transition: 2.5s;
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
