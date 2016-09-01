'use strict';

import API from './api/api';
import OAuth from './api/hello';
import Cookies from 'js-cookie';
import { PromoOptions } from 'appSettings';

export default (function App(window, document, $){

	const cookieName = 'registered-to-vebinar';

	const $button = $('.js-vebinar-registration');
	const $result = $('.js-vebinar-registration-message');
	const $loader = $('.js-share-loader');

	let profile = {};

	function asyncStart(){
		console.log('go');
		$button.attr('disabled', 'disabled').text('Отправка...');
		$loader.show();
	}

	function asyncEnd(){
		console.log('end');
		$button.attr('disabled', false).text('ЗАПИСАТЬСЯ НА ВЕБИНАР');
		$loader.hide();
	}

	function buttonHide(message){
		console.log(message);
		$button.hide();
		$result.html(message);
	}


	function getUser(){
		asyncStart();

		API.getUser()
		.then( user => {
			console.log(user);
			profile = user;
		})
		.catch( err => {
			console.error(err);
		})
		.then( () => {
			asyncEnd();
		});	
	}

	function registerUser(){

		if (!profile){
			console.log('no profile');
			return;
		}

		const data = {
			id: profile.id_str,
			personId: profile.personId_str,
			fullName: profile.fullName,
			login: profile.login,
			email: profile.email,
		}

		console.log(JSON.stringify(data));

		asyncStart();

		$.ajax({
			url: 'https://formspree.io/shinkarenko@company.dnevnik.ru', 
		    method: 'POST',
		    data: data,
		    dataType: 'json',
		    success: function( response ) {
		    	console.log(response);
		    	Cookies.set(cookieName, 'true');
				buttonHide('Спасибо! Ваша заявка была успешно отправлена!')
		    },
		    error: function(xhr, ajaxOptions, error){
		    	console.log('Data could not be saved. ' + error);
				$result.html('Ошибка отправки данных, попробуйте еще раз. Если ошибка повторится - свяжитесь с нами.');
		    },
		    complete: function(){					    	
		    	//$success.show();
				//$button.attr('disabled', false).text('Отправить заявку');			    	
		    	asyncEnd();
		    }
		});	

	}

	function actions(){

		$button.on('click', function(e){
			e.preventDefault();			

			if (!profile.id){

				asyncStart();

				OAuth.login()
				.then( ()=> {
					return API.getUser();
				})
				.then( user => {
					profile = user;

					console.log(profile);
					return registerUser();
				})
				.then( 
					() => {
						
					},
					err => {
						console.log(err);
					}
				).then( () => {
					asyncEnd();
				});

			}else{
				registerUser();
			}
			
		});
	}

	function init(){

		if (location.href.indexOf('bulling-parents') === -1
			&& location.href.indexOf('bulling-teachers') === -1){
			return false;
		}

		if (!Cookies.get(cookieName)){
			getUser();
			actions();
		}else{
			buttonHide('Вы уже записаны на вебинар');
		}
	}

	return {
		init
	}

})(window, document, jQuery, undefined);
