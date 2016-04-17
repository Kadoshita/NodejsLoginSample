var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();

mongoose.connect('mongodb://localhost/User');
mongoose.connection.on( 'connected', function(){
	console.log('connected.');
});

mongoose.connection.on( 'error', function(err){
	console.log( 'failed to connect a mongo db : ' + err );
});

// mongoose.disconnect() を実行すると、disconnected => close の順番でコールされる
mongoose.connection.on( 'disconnected', function(){
	console.log( 'disconnected.' );
});

mongoose.connection.on( 'close', function(){
	console.log( 'connection closed.' );
});

// スキーマの定義
// 実際のドキュメントのフィールドを過不足なく定義する必要はない
// (もちろん存在しないフィールドを定義しても意味はない)
// mongooseを使って取得・設定したいフィールドを定義する
// ここで定義したフィールドがオブジェクトの変数となる
var unicornSchema = mongoose.Schema({
	email : String,
	password : String,
	sports:String
});

// コレクション名とスキーマを入力として、モデルを取得する
var users = mongoose.model('users', unicornSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Login',message:'' });
});

router.post('/', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	if(email!="" && password!=""){
		// find()を使って検索する
		users.find( {email: email }, function( err, docs ){

			// 検索結果がdocsとして入力されるので、ループで取り出す
			docs.forEach( function( element ){
				// Schemaで定義した変数のアクセス方法は、element.<フィールド名>
				console.log( element.email + " " + element.password + " " + element.sports );
				if(password==element.password){
					email=element.email;
					res.redirect('/user?'+element.sports);
				}
				else{
					res.render('login',{title: 'Login',message:'missing email or password!'});
				}
			},this);
		});
	}
	else
		res.render('login',{title: 'Login',message:'missing email or password!'});
});
module.exports = router;