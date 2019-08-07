<template>
  <div class="container">
      <h1>{{this.boardName}}</h1>
      <div id="board">
      <div class="board-box">
      <div v-show="isLogged" class="row form-group">
        <div class="col-sm-10"></div>
        <div class="col-sm-2" >
          <button type="button" class="btn btn-secondary"
        @click="createPost()">글 등록</button>
        </div>
      </div>
      <div class="row">
          <!-- print meeting log list -->
          <table class="table table-striped">
            <thead>
               <tr class="text-center">
                <th class="text-center" scope="col">#</th>
                <th class="text-center">카테고리</th>
                <th class="text-center">작성자</th>
                <th class="text-center">부서</th>
                <th class="text-center">제목</th>
                <th class="text-center">작성일시</th>
                <th class="text-center">추천수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in result" @click="readPost(item)" :key="index" style="cursor: pointer">
                <td scope="col">{{index+1}}</td>
                <td>{{item.카테고리명}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.부서명}}</td>
                <td width=400>{{item.제목}}</td>
                <td>{{item.writetime}}</td>
                <td width=100>{{item.추천수}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row form-group">
        <label class="col-sm-1">검색</label>
        <div class="col-sm-2">
        <b-form-select v-model="searchCategory" class="mb-3">
          <option value="0" >전체 카테고리</option>
          <option v-for="(category, index) in categories" :key="index" :value="category.카테고리번호">{{category.카테고리명}}</option>
        </b-form-select>
        </div>
        <div class="col-sm-2">
        <b-form-select v-model="searchDept" class="mb-3">
          <option value="0" >전체 부서</option>
          <option v-for="(dept, index) in depts" :key="index" :value="dept.부서명">{{dept.부서명}}</option>
        </b-form-select>
        </div>
        <div class="col-sm-5">
          <input class="form-control" v-model="name" @input="getResult(true)" @keydown.enter="getResult(true)" placeholder="게시글명 또는 작성자를 입력해주세요(대소문자 구분).">
        </div>
        <div class="col-sm-1">
          <button class="btn btn-sm btn-primary" @click.prevent="getResult(true)">검색</button>
        </div>`
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted: function() {
    this.boardId = this.$route.query.boardId;
    this.boardName = this.$route.query.boardName;
    console.log(this.boardId);
    this.getData();
    this.getCategories();
    this.getDepts();
  },
  watch: {
      $route: function(to, from){
        this.boardId = this.$route.query.boardId
        this.boardName = this.$route.query.boardName;
        console.log('현재 게시판 번호 : '+this.boardId)
        this.getData();
        this.getCategories();
        this.getDepts();
      }
  },
  computed: {
        
    },
  methods: {
        getData: function(){
            var url = this.$config.targetURL+'/board/post?boardId='+this.boardId
            console.log(url)
            this.$http.get(url)
            .then(result=>{
                //console.log(result)
                console.log(JSON.parse(result.data.result))
                this.list = JSON.parse(result.data.result)
                //console.log(list)
                this.boardName = this.list[0].게시판명;
                this.list.forEach(v=>{
                  var dateinfo = v.작성시각
                  v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY년 M월 D일 H시 m분')
                })
                 this.getResult(true);
            })
            .catch(error=>{
                console.log('서버에러')
                
            }) 
        },
        getCategories: function() {
          var url = this.$config.targetURL+'/board/categories/';
          this.$http.get(url)
          .then(r=>{
            if(r.data.status=="success") {
              this.categories = JSON.parse(r.data.result);
              console.log(this.categories);
            }
          })
        },
        getDepts: function() {
           var url = this.$config.targetURL+'/users/depts/';
          this.$http.get(url)
          .then(r=>{
            if(r.data.status=="success") {
              this.depts = JSON.parse(r.data.result);
              console.log(this.depts);
            }
          })
        },
        createPost: function() {
            this.$router.push({
                name: 'PostUploader',
                query: {
                    boardId: this.boardId,
                    mode: 'create'
                }
            })
        },
        readPost: function(item) {
            this.$router.push({
                name: 'PostViewer',
                query: {
                    postId: item.게시글번호
                }
            })
        },
        getResult: function(flag){
            let arr_base=[];
            let arr=[];            
            for(var i=0;i<this.list.length;i++){
              if(this.name && ((this.list[i].제목.indexOf(String(this.name)) == -1) && (this.list[i].이름.indexOf(String(this.name)) == -1)))
                continue;
              if(this.searchCategory!=0 && this.list[i].소속카테고리!=this.searchCategory)
                continue;
              if(this.searchDept!=0 && this.list[i].부서명!=this.searchDept)
                continue;
              arr_base.push(this.list[i]);
            }
            this.result = arr_base;
            //console.log(this.result);
            //this.result = arr_base.slice(this.page_max*this.page, this.page_max*(this.page+1));
        }
    },
    data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      boardId: '',
      boardName: '',
      list: [],
      result: [],
      name: '',
      searchCategory: '0',
      searchDept: '0',
      categories: [],
      depts: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    src:url('../assets/Droid-Sans-Fallback.ttf') format('truetype');
    font-weight : normal;
    font-style : normal;
}
div {
 font-family: 'Olleh','NanumGothic';
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
