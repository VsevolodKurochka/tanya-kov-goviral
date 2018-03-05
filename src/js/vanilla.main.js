// General functions
function log(content){
	console.log(content);
}

var hasClass = (element, cls) => (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;

function addClass(element,cls){
	if( !hasClass(element, cls) ){
		let empty = '';
		if(element.classList.value != "") empty = ' ';
		element.className += empty + cls;
	}
}

function removeClass(element, cls){
	if( hasClass(element, cls) ) element.classList.remove(cls);
}

function toggleClass(element, cls){
	hasClass(element, cls) ? removeClass(element, cls) : addClass(element, cls);
}

var exists = element => typeof(element) != 'undefined' && element != null;

class Modal {
	constructor(){

		// Prefix for modal class
		this.prefix = '';

		// Name of modal class
		this.name = `${this.prefix}modal`;

		// All modals
		this.modals = document.querySelectorAll(`.${this.name}`);

		// Open Buttons
		this.openButtons = document.querySelectorAll(`[data-action="${this.name}"]`);

		// Close Button(`x`)
		this.closeButtons = document.querySelectorAll(`[data-close="${this.name}"]`);

		this.modalClickEvents = ['click'];

		//log(this.openButtons);
		// this.openButtons.forEach( (openButton) => {
		// 	log(openButton);
		// 	//openButton.addEventListener('click', (e) => this._showButtonClick(e, this));
		// });

		for(let i = 0; i < this.openButtons.length; i++){
			this.openButtons[i].addEventListener('click', (e) => {
				this._showButtonClick(e);
			});
		}

		for(let i = 0; i < this.closeButtons.length; i++){
			this.closeButtons[i].addEventListener('click', (e) => {
				this._closeButtonClick(e);
			});
		}

		document.body.addEventListener('click', (e) => {
			this._bodyClick(e);
		});

		//console.log(this.openButtons.length);

		// this.modalClickEvents.forEach( (modalClickEvent) => {

		// 	// document.body.addEventListener(modalClickEvent, (e) => {
		// 	// 	this._bodyClick(e, this);
		// 	// });

			

		// 	// this.closeButtons.forEach( (button) => {
		// 	// 	button.addEventListener(modalClickEvent, (e) => this._closeButtonClick(e, this));
		// 	// });

		// });
	}


	modalClose(el){
		removeClass(el, `${this.name}_showing_in`);
		removeClass(document.body, `${this.name}-open`);
	}

	modalOpen(el){
		addClass(document.body, `${this.name}-open`);
		addClass(el, `${this.name}_showing_in`);
	}

	_showButtonClick(e) {

		let target = e.target;

		let targetButton = target.closest(`[data-action='modal']`);

		// // Get button data-attributes
		var modalData = targetButton.dataset;
		
		// Get attribute data-open and replace # with empty line
		var modalID = modalData.open.replace("#", "");
		
		
		if( exists(document.getElementById(modalID) ) ){

			let modalCurrent = document.getElementById(modalID);

			this.modalOpen(modalCurrent);

			if(modalData.video != undefined){
				

				if( exists(modalCurrent.getElementsByClassName('modal__video')[0]) ){

					this._removeIframe(modalCurrent);

					let videoIframe = document.createElement('iframe');

					addClass(videoIframe, 'modal__video-iframe');

					let videoSRC = modalData.video;
					videoIframe.setAttribute('src', videoSRC);
					videoIframe.setAttribute('allow', 'autoplay; encrypted-media');
					videoIframe.setAttribute('allowfullscreen', 'allowfullscreen');

					videoWrapper.appendChild(videoIframe);
				}
			}

		}else{
			console.error('No element with ID: ' + modalID);
		}
		
	}

	_removeIframe(element){
		if( exists(element.getElementsByClassName('modal__video')[0]) ){
			let _videoWrapper = element.getElementsByClassName('modal__video')[0];
			_videoWrapper.innerHTML = '';
		}
	}

	_closeButtonClick(e) {

		let modalCurrent = e.target.closest(`.${this.name}`);
		this.modalClose( modalCurrent );

		this._removeIframe(modalCurrent);
	}

	_getEventTarget(e){
		var targ;

		if (e.target) { // W3C
			targ = e.target;
		}else if (e.srcElement) { // IE6-8
			targ = e.srcElement;
		}else if(e.originalTarget){
			targ = e.originalTarget;
		}
		if (targ.nodeType == 3) { // Safari
			targ = targ.parentNode;
		}
		return targ;
	}

	_bodyClick(e){
		let target = this._getEventTarget(e);

		//log(target);
		for(let i = 0; i < this.modals.length; i++){

			let targetModal = this.modals[i];

			if(target == targetModal){
				this.modalClose(targetModal);
				this._removeIframe(targetModal);
			}
		}
	}
}

(function(){
	document.addEventListener("DOMContentLoaded", function(){
		
		new Modal();

		new WOW({
			callback: function(box){
				if( hasClass(box, 'result__item') ){
					setTimeout(function(){
						addClass(box, 'result__item_animated');
					}, 1500);
				}
			}
		}).init();

		const checkResultAnimatedItems = () => {
			if(document.getElementsByClassName('result__item_animated').length == 5){
				setTimeout(() => {
					addClass(document.getElementById('js-result-attention'), 'result__attention_active');
				}, 5000);
				clearInterval(checkResultInterval);
			}
		}

		checkResultAnimatedItems();

		const checkResultInterval = setInterval(checkResultAnimatedItems, 500);


		const resultAttentionButtonClick = () => {
			removeClass(document.getElementById('js-result-attention'), 'result__attention_active');
		}

		document.getElementById('js-result-attention-close').addEventListener('click', () => {
			resultAttentionButtonClick();
		} );


		const collectInputs = document.getElementsByClassName('form__control');

		for(let i = 0; i < collectInputs.length; i++){
			collectInputs[i].addEventListener('click', function(){
				addClass(this.parentNode, 'clicked');
			});
		}


		//clearInterval();

		const scroll = new SmoothScroll('a[href*="#"]', {
			offset: 70
		});

		const themePrefix = '';

		// Anchors links
			function scrollTo(element, to, duration) {
				if (duration <= 0) return;
				var difference = to - element.scrollTop - 75;
				var perTick = difference / duration * 10;
				setTimeout(function() {
					element.scrollTop = element.scrollTop + perTick;
					if (element.scrollTop === to) return;
					scrollTo(element, to, duration - 10);
				}, 10);
			}
			
			// Anchors
				const anchors = document.getElementsByClassName('anchor');

				for(let i = 0; i < anchors.length; i++){
					anchors[i].addEventListener('click', (e) => {
						e.preventDefault();
						let href = this.getAttribute("href").replace("#", "");
						let scrollAnchor = document.getElementById(href);
						scrollTo(document.body, scrollAnchor.offsetTop, 600);
					});
				}
			
		// Navigation
			const jsNav = document.getElementById('navigation');

			// Navigation links
				const jsNavLinks = document.querySelectorAll(`${themePrefix}nav__menu a[href*="#"]`);

				for(var i = 0; i < jsNavLinks.length; i++){
					jsNavLinks[i].addEventListener('click', (e) => {
						e.preventDefault();

						let vnavhref = this.getAttribute("href").replace("#", "");
						let vnavscrollAnchor = document.getElementById(vnavhref);

						removeClass(jsNavBtn, 'active');
						removeClass(jsNav, `${themePrefix}nav__menu_active`);

						scrollTo(document.body, vnavscrollAnchor.offsetTop, 600);

					});
				}

			// Button HAMBURGER
				const jsNavBtn = document.getElementById('js-vnav__btn');

				if(exists(jsNavBtn)){
					jsNavBtn.addEventListener('click', function(){
						toggleClass(this, 'active');
						toggleClass(jsNav, `${themePrefix}nav__menu_active`);
					});
				}


			// Click on toggle element in navigation
				const jsNavText = document.getElementById('js-vnav-addition');
				if(exists(jsNavText)){
					jsNavText.addEventListener('click', function() {
						toggleClass(this, 'active');
					});	
				}
	});
}());