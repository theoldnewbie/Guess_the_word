	var words = [];
	// [
	// word1 = {
	// 	title: 'Один удар, четыре дырки.',
	// 	word: ['в','и','л','к','а']
	// },
	// word2 = {
	// 	title: 'Сирень на украинском',
	// 	word: ['б','у','з','о','к']
	// },
	// word3 = {
	// 	title: 'Основной ингридиент борща',
	// 	word: ['б','у','р','я','к']
	// },
	// word4 = {
	// 	title: 'Предмет интерьера',
	// 	word: ['д','и','в','а','н']
	// },
	// word5 = {
	// 	title: '... Норушка',
	// 	word: ['м','ы','ш','к','а']
	// },
	// word6 = {
	// 	title: 'Часть механизма, за которую нужно дернуть',
	// 	word: ['р','ы','ч','а','г']
	// },
	// word7 = {
	// 	title: 'Круг 3D',
	// 	word: ['с','ф','е','р','а']
	// },
	// word5 = {
	// 	title: 'Одежда',
	// 	word: ['д','ж','и','н','с','ы']
	// },
	// word6 = {
	// 	title: 'В тумане',
	// 	word: ['ё','ж']
	// },
	// word7 = {
	// 	title: 'Самая большая ягода',
	// 	word: ['а','р','б','у','з']
	// },
	// word8 = {
	// 	title: 'Воет на луну',
	// 	word: ['в','о','л','к']
	// },
	// word9 = {
	// 	title: 'Красный синьор',
	// 	word: ['п','о','м','и','д','о','р']
	// },
	// word10 = {
	// 	title: 'Симбад ...',
	// 	word: ['м','о','р','е','х','о','д']
	// },
	// word11 = {
	// 	title: 'Общий вид местности',
	// 	word: ['л','а','н','д','ш','а','ф','т']
	// },
	// ];
var arr1;
var arr2 = ['_','_','_','_','_','_','_','_'];
var $formInput = $('#form');
var $inputLetter = $('#input');
var $startBtn = $('#start');
var $nextBtn = $('#next');
var $restart = $('#restart');
var score;
var point = 0;
var heard;
var sameLetter = false;

var addRandomWord = function(){
	for(var i =0;  i<arr2.length; i++){
		var btn = document.getElementById(i);
		btn.setAttribute('hidden', true);
	};
	var num = Math.floor(Math.random() * (words.length - 0)) + 0;
	arr1 = words[num].word;
	for(var i = 0; i<arr1.length; i++){
		var id = i;
		var btn = document.getElementById(id);
		btn.innerHTML = '';
		btn.removeAttribute('hidden');
	};
	var form = document.getElementById('form');
	form.removeAttribute('hidden');
	var next = document.getElementById('next');
	next.setAttribute('hidden', true);
	arr2 = ['_','_','_','_','_','_','_','_'];

	$('#title').html(words[num].title + '?');
	$('#heard').html(heard);
	var log = document.getElementById('log');
	log.innerHTML = '';
	$inputLetter.attr('autofocus', true);
};
var startGame = function(){
	$.ajax({
  	dataType: 'json',
  	method: 'GET',
    url: '',
    success: function(data) {
     words = data;
    },
    error: function(data) {
     console.error(data);
    }
 });
	var page = document.getElementById('page');
	page.removeAttribute('hidden');
	var btnStart = document.getElementById('start');
	btnStart.setAttribute('hidden', true);
	var end = document.getElementById('end');
	end.setAttribute('hidden', true);
	heard = 5;
	score = 0;
	$('#score').html(score);

	addRandomWord();
}

	var letterText = (function(){
		var _value = '';
		return {
			get: function(){
				return _value;
			},
			set: function(val){
				_value=val;
				$inputLetter.trigger('inputLetter:change', val);
			}
		};
	})();

	var onSubmitHandler = function(event){
		letterText.set($inputLetter.val());
		event.preventDefault();
	};



	var guessLetter = function(event, text) {

		$inputLetter.val('');
		var goodLetter = false;
		var haveSpace = false;
		var letter = text;
		var tempScore;

		for(var i = 0 ; i < arr1.length ; i++){
			if(arr1[i] == letter){
				if(arr1[i]!=arr2[i]){
					point++;
					var tempScore = point*100;
					score = score + tempScore;
					var h3 = document.getElementById('score');
					h3.innerHTML = score;
					goodLetter = true;
				}
				if(arr1[i]==arr2[i]){
					sameLetter = true;
				};

				arr2[i]=letter;
				var btn = document.getElementById(i);
				btn.innerHTML = letter;
			};

			if(arr2[i] == '_'){
				haveSpace = true;
			}
		}

		if (goodLetter) {
				var h2 = document.getElementById('log');
				h2.innerHTML = 'Правильная буква!';

			if(!haveSpace){
				var h2 = document.getElementById('log');
				h2.innerHTML = 'Слово отгадано, вы получили одну жизнь,продолжим?';
				var form = document.getElementById('form');
				form.setAttribute('hidden', true);
				var next = document.getElementById('next');
				next.removeAttribute('hidden');
				heard++;

			}
		} else if(sameLetter){
				var h2 = document.getElementById('log');
				h2.innerHTML = 'Эта буква уже была введена!';
				sameLetter = false;
		} else{
			point = 0;
			var h2 = document.getElementById('log');
				h2.innerHTML = 'Неверная буква!';
			heard--;
			if(heard!=0){
				$('#heard').html(heard);
			} else {
				var page = document.getElementById('page');
				page.setAttribute('hidden', true);
				var end = document.getElementById('end');
				end.removeAttribute('hidden');
				var log = document.getElementById('log');
				log.innerHTML = '';
				$('#you_score').html('Ваш счет: ' + score);
			}
			
		}
	};

	$formInput.on('submit', onSubmitHandler);
	$inputLetter.on('inputLetter:change', guessLetter);
	$startBtn.on('click', startGame);
	$nextBtn.on('click', addRandomWord);
	$restart.on('click', startGame);
