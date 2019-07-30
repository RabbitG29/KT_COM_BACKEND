<template>
  <div class="login container" style="text-align: center;">
    <div class="" style="">
        <div v-show="!isLogged" class="col-sm-4" style="margin: 0 auto;">
          <h1>LOGIN</h1>
            <form>
                <div class="form-group">
                    <label for="id">사번</label>
                    <input class="form-control" id="id" aria-describedby="emailHelp" placeholder="Enter ID" v-model="id">
                    <small id="emailHelp" class="form-text text-muted"></small>
                </div>
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
                </div>
                <button class="btn btn-primary" @click.prevent="submit">로그인</button>
            </form>
        </div>
    </div>
   <div v-show="isLogged">
        <meta http-http-equiv="refresh" content="0;url=/">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: 'Login',
      id: '',
      password: '',
      name: '',
    }
  },
  computed: {
    isLogged () {
        return this.$store.getters.isLogged
    }
  },
  methods: {
      logIn(data){
        console.log("commit")
        console.log(data.id)
        console.log(data.name)
        this.$store.commit('logIn', { // TODO : 사원정보넣기!!
            id: data.id,
            name: data.name
        })
      },
      submit() {
          //this.$store.getters.isLogged=true;
          //this.$router.push("/");
          this.$http.get(this.$config.targetURL+`/users/login?id=${this.id}&password=${this.password}`)
          .then((result)=>{
              if(result.data.status == 'success'){ // 로그인 성공
                  console.log('success')
                  console.log(result.data)
                  this.logIn(result.data)
                  this.$notice({
                      type: 'success',
                      text: '로그인이 성공적으로 완료되었습니다.',
                  })
                  this.$router.push("/")
              }
              else {
                console.log('error')
                    this.$notice({
                        type: 'alert',
                        text: '로그인 정보가 올바르지 않습니다'
                    })
              }
            })
          .catch((error)=>{
            console.log('server success')
            this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
          })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
@font-face {
    font-family: 'Olleh';
    src:url('../assets/Droid-Sans-Fallback.ttf') format('truetype');
    font-weight : normal;
    font-style : normal;
}
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
div {
 font-family: 'Olleh', 'NanumGothic';
}
</style>