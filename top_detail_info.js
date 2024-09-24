/**
 * WINDOWS RESIZE 반응형 관련
 --------------------------------------------------------------------------- */
//리사이즈
(function () {
    var throttle = function (type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function () {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle('resize', 'optimizedResize');
})();


function addScript(filepath, callback) {
  if (filepath) {
	  var fileref = document.createElement('script');
	  var done = false;
	  var head = document.getElementsByTagName('head')[0];

	  fileref.onload = fileref.onreadystatechange = function () {
		  if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
			  done = true;
			  if(callback) callback();

			  // Handle memory leak in IE
			  fileref.onload = fileref.onreadystatechange = null;
			  if (head && fileref.parentNode) {
				  head.removeChild(fileref);
			  }
		  }
	  };

	  fileref.setAttribute('type', 'text/javascript');
	  fileref.setAttribute('src', filepath);

	  head.appendChild(fileref);
  }
}



var optimizedResize = (function () {
    var callbacks = [],
        running = false;
    // fired on resize event
    function resize() {
        if (!running) {
            running = true;
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }
    }

    // run the actual callbacks
    function runCallbacks() {
        callbacks.forEach(function (callback) {
            callback();
        });
        running = false;
    }

    // adds callback to loop
    function addCallback(callback) {
        if (callback) {
            callbacks.push(callback);
        }
    }
    return {
        // public method to add additional callback
        add: function (callback) {
            if (!callbacks.length) {
                window.addEventListener('resize', resize);
            }
            addCallback(callback);
        }
    }
}());


// IE 폴리필
(function () {
    if (typeof window.CustomEvent === 'function') return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();



window.addEventListener('load', function () {

    var customPage = document.querySelector('.custom_page');
    /**
     * 신규쇼핑몰의 경우 보안이슈때문에 이미지를 가져다 쓸수없다.
     * 파일명 필드추가후 사용하기로한다.
     */
    var swiperThumbEl = document.querySelector('.custom_filename');
    if(!swiperThumbEl) return;
    
    
    const mockupImage = new Image();
    mockupImage.src = `/mockup/${swiperThumbEl.textContent}`;
    

    // 이미지가 로드되면 자연적인 크기를 콘솔에 출력합니다.
    mockupImage.onload = function() {
        console.log('이미지의 로드완료'); 
        
        console.log(`이미지의 너비: ${mockupImage.naturalWidth}px`);
        console.log(`이미지의 높이: ${mockupImage.naturalHeight}px`);
        
        // 해당상품이 커스텀페이지일 경우
        if (customPage && customPage.textContent.toUpperCase() === 'Y') {

            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf('msie') != -1) {
                alert('서비스를 정상적으로 이용하기 위해\n크롬브라우저, Edge, 네이버 웨일, 사파리, 파이어폭스 같은 최신 브라우저가 필요합니다.\n또는 모바일웹에서 실행해주세요.');
                document.location.href = '/';
            } else {
                /*
                var script1 = '/theme/customhash/library/fabricjs/js/fabric.min.js';
                var script2 = '/theme/customhash/components/feature/text_custom_editor/js/text_custom_editor.js?date=20240902';
                addScript(script1, addScript(script2, loadWebFont));
                */

                loadWebFont();
            }


            // 로딩 인디케이터 시작
            var spinHandle = loadingOverlay().activate();

            /**
             * 폰트 로더 구동
             * 커스텀 텍스트에 활용될 폰트 불러오기
             --------------------------------------------------------------------------- */
            function loadWebFont() {
                WebFont.load({
                    google: {
                        families: ['Black Han Sans', 'Noto Serif KR', 'Noto Sans KR', 'Nanum Pen Script', 'Damion', 'Homemade Apple', 'Sacramento', 'Pacifico']
                    },
                    active: doActive
                });
            }

            /**
             * 커스텀 관련 정보 수집
             --------------------------------------------------------------------------- */
            //var customObjInfoEl = document.querySelector('.custom_obj_w_h_r').textContent.split(',');
            var customInfo = {
                'clipPath': {
                    'width': 1024,
                    'height': 1024,
                    'radius': 0
                },
            };


            /**
             * customTextPosition 값에 따라 실행
             */
            var customTextPosition = document.querySelector('.custom_text_position');
            // SCARF일 때 실행할 로직
            if (customTextPosition && customTextPosition.textContent.toUpperCase() === 'SCARF') { 

                /**
                 * 커스텀 관련 옵션으로 Element 만들기
                 * 1. 기존 옵션 Element들을 변수에 담기
                 * 2. 변수에담은 Element들을 활용하여 별도의 커스텀 박스 형태로 구조 변경
                 --------------------------------------------------------------------------- */
                var findTextEl = document.querySelectorAll('.xans-product-option .xans-product th');



                var customTextEl = '';
                var customColorEl = '';
                var customObjEl = '';
                var customImageEl = '';
                var customFormField = {};

                for (var i = 0; i < findTextEl.length; i++) {
                    if (findTextEl[i].textContent === '커스텀::텍스트[선택]' || findTextEl[i].textContent === '커스텀::텍스트[필수]') {
                        customTextEl = findTextEl[i].nextElementSibling.querySelector('input');
                        customFormField.custom_text = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item text-item"><div class="item__title">텍스트</div><div id="custom-text" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '커스텀::레이아웃') {
                        customFormField.custom_layout = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">레이아웃</div><div id="custom-layout" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '커스텀::스타일') {
                        customFormField.custom_style = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">스타일</div><div id="custom-style" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '커스텀::텍스트색상' || findTextEl[i].textContent === '커스텀::텍스트 색상') {
                        customFormField.custom_text_color = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">텍스트색상</div><div id="custom-text-color" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '색상' || findTextEl[i].textContent === '케이스 색상' || findTextEl[i].textContent === '케이스색상' || findTextEl[i].textContent === '미리보기') {
                        customColorEl = findTextEl[i].nextElementSibling.querySelector('ul.ec-product-preview');
                    } else if (findTextEl[i].textContent === '커스텀::obj[선택]' || findTextEl[i].textContent === '커스텀::obj[필수]') {
                        customFormField.custom_obj = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">커스텀::obj</div><div id="custom-obj" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '커스텀::mask[선택]' || findTextEl[i].textContent === '커스텀::mask[필수]') {
                        customFormField.custom_mask = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">커스텀::mask</div><div id="custom-mask" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    } else if (findTextEl[i].textContent === '커스텀::image[선택]' || findTextEl[i].textContent === '커스텀::image[필수]') {
                        customFormField.custom_image = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">커스텀::image</div><div id="custom-image" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                        findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                    }
                }

                /* 커스텀영역 element 생성 
                customOptionDiv: 최상위 컨테이너로, 전체 커스텀 옵션을 감싸는 역할.
                customOptionStrong: "커스텀 제작하기"와 같은 옵션 설명 제목을 굵게 표시하는 부분.
                customOptionBox: 실제 커스텀 옵션 필드들이 들어갈 박스.
                */
                var customOptionDiv = document.createElement('div');
                var customOptionStrong = document.createElement('strong');
                var customOptionBox = document.createElement('div');

                // 커스텀필드 추가하기
                customOptionBox.innerHTML = customFormField.custom_layout + customFormField.custom_style + customFormField.custom_text_color + customFormField.custom_text + customFormField.custom_obj + customFormField.custom_image; //이 코드를 통해 customOptionBox 안에 레이아웃, 스타일, 텍스트 색상, 텍스트, obj, 이미지 필드가 전부 들어가게 돼.
                customTextEl = customOptionBox.querySelector('#custom-text input'); //텍스트 입력 필드를 찾음.
                customObjEl = customOptionBox.querySelector('#custom-obj input'); //obj 입력 필드를 찾음.
                customImageEl = customOptionBox.querySelector('#custom-image input'); //이미지 입력 필드를 찾음.
                customObjEl.value = customInfo.clipPath.width + '||' + customInfo.clipPath.height + '||' + customInfo.clipPath.radius; //이 부분은 **customObjEl**의 값을 설정하는 코드야. 텍스트가 들어갈 영역
                customImageEl.value = mockupImage.src; //이미지 필드의 값을 미리보기 이미지의 경로로 설정해서 커스텀 이미지에 반영

                //읽기전용으로 설정, 이렇게 하면 고객이 obj나 이미지 필드의 값을 직접 수정할 수 없고, 시스템에서 설정된 값만 사용할 수 있게 돼. 
                customObjEl.readOnly = true;
                customImageEl.readOnly = true;



                var customLayoutEl = customOptionBox.querySelector('#custom-layout');
                var customStyleEl = customOptionBox.querySelector('#custom-style');
                var customTextColorEl = customOptionBox.querySelector('#custom-text-color');


                /*
                이 코드는 커스텀 옵션을 보여주는 영역을 설정하는 역할을 해. 
                먼저, **제목("커스텀 제작하기")**을 설정하고, 그다음 ID와 클래스를 지정해서 스타일을 적용하거나 특정 동작을 정의할 수 있게 만들어. 
                마지막으로, **옵션 필드를 담는 박스(customOptionBox)**를 전체 영역(customOptionDiv)에 추가해서, 옵션을 화면에 표시할 준비를 완료해.
                이렇게 만든 구조는 최종적으로 사용자가 커스텀 옵션을 볼 수 있는 영역을 만들어 주는 거야.
                */
                customOptionStrong.textContent = '커스텀 제작하기';
                customOptionDiv.id = 'custom-option-list';
                customOptionDiv.className = 'custom-option-list';
                customOptionBox.className = 'custom-option-box';
                customOptionDiv.append(customOptionStrong);
                customOptionDiv.append(customOptionBox);

                var productOptionTableEl = document.querySelector('table.xans-product-option'); //이 변수는 상품 옵션 테이블을 가리키고 있어. 상품 등록 페이지에서 옵션을 표시하는 테이블을 가져오는 거야.
                productOptionTableEl.parentNode.insertBefore(customOptionDiv, productOptionTableEl.nextSibling); //상품 옵션 테이블 바로 뒤에 커스텀 옵션 박스를 추가하는 역할을 해.

                var customTextLength = document.querySelector('#custom-text .length'); //**customTextLength**는 텍스트 입력 필드와 관련된 부분으로, 고객이 입력한 텍스트의 길이 정보를 표시할 때 유용하게 쓸 수 있어
                var selectorEl = document.querySelector('#custom-page-canvas'); //즉, 고객이 커스텀한 내용을 미리보기로 확인하는 공간일 수 있어.

                var customOptionEl = document.querySelector('.custom_page').closest('tr'); //상품 옵션 테이블의 특정 행을 찾기 위한 작업이야.

                customOptionEl.classList.add('displaynone'); //즉, 이 코드는 커스텀 옵션 테이블의 특정 행을 숨기기 위한 작업으로, 필요에 따라 특정 옵션을 표시하지 않게 만드는 거야.


                // 폰트로딩완료시
                function doActive() {
                    console.log('구글폰트 로딩완료 - SCARF');


                    // 커스텀텍스트에디터 생성
                    var customTextEditor = new CustomTextEditor.Editor({
                        target: selectorEl,
                        bgImage: mockupImage,
                        customTextEl: customTextEl,
                        spinHandle: spinHandle,
                        clipPath: {
                            width: customInfo.clipPath.width,
                            height: customInfo.clipPath.height,
                            radius: customInfo.clipPath.radius
                        },
                        defaults: {
                            fontFamily: 'Black Han Sans',
                            align: '가운데하단',
                            text: '',
                            color: '#FFFFFF'
                        }
                    }, function () {
                        console.log('로딩완료');
                    });

                    /*
                    * ----------------------------------------------------------------
                    * 이벤트 할당
                    * ----------------------------------------------------------------
                    */

                    /**
                     * 텍스트 필드가 채워질때
                     * Lodash를 이용하여 입력시간 이벤트를 지연한다.
                     */
                    customTextEl.addEventListener('keyup', _.debounce(function (e) {
                        customTextEditor.setText(this.value);
                    }, 300));

                    /**
                     * 케이스색상 옵션을 선택했을때
                     */
                    if (customColorEl) {
                        customTextEditor.addEvent(customColorEl, 'click', 'custom_color', function () {

                            return [null, customImageEl];
                        });
                    }

                    /**
                     * 텍스트 레이아웃을 선택했을때
                     */
                    if (customLayoutEl) {
                        customTextEditor.addEvent(customLayoutEl, 'click', 'custom_layout');
                    }
                    /**
                     * 텍스트 스타일을 선택했을때
                     */
                    if (customStyleEl) {
                        customTextEditor.addEvent(customStyleEl, 'click', 'custom_font');
                    }

                    /**
                     * 텍스트 색상을 선택했을때
                     */
                    if (customTextColorEl) {
                        customTextEditor.addEvent(customTextColorEl, 'click', 'custom_font_color');
                    }
                }

                /*
                 * ----------------------------------------------------------------
                 * 반응형 관련
                 * ----------------------------------------------------------------
                 */

                /**
                 * RESIZE 관련 기능
                 */
                (function () {
                    window.addEventListener('resize', resizeThrottler, false);

                    var resizeTimeout;
                    function resizeThrottler() {
                        // ignore resize events as long as an actualResizeHandler execution is in the queue
                        if (!resizeTimeout) {
                            resizeTimeout = setTimeout(function () {
                                resizeTimeout = null;
                                actualResizeHandler();

                                // The actualResizeHandler will execute at a rate of 15fps
                            }, 66);
                        }
                    }

                    function actualResizeHandler() {
                        // handle the resize event
                        customTextEditor.resizeCanvasZoom(selectorEl.offsetWidth, selectorEl.offsetHeight);
                    }
                }());

            } else if (customTextPosition && customTextPosition.textContent.toUpperCase() === 'GLOVE') { // GLOVE일 때 실행할 로직
                // 왼손 옵션들
                var customTextElLeft = '';
                var leftHandLayoutEl = '';
                var leftHandStyleEl = '';
                var leftHandTextColorEl = '';
                var customObjElLeft = '';
                var customImageElLeft = '';
                var customFormFieldLeft = {};

                    for (var i = 0; i < findTextEl.length; i++) {
                        if (findTextEl[i].textContent === '커스텀장갑왼손::텍스트[선택]' || findTextEl[i].textContent === '커스텀장갑왼손::텍스트[필수]') {
                            customTextElLeft = findTextEl[i].nextElementSibling.querySelector('input');
                            customFormFieldLeft.custom_left_hand_text = customTextElLeft.outerHTML.replace(/<td[^>]*>/g, '<div class="item text-item"><div class="item__title">왼손 텍스트</div><div id="custom-left-hand-text" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑왼손::레이아웃') {
                            customFormFieldLeft.custom_left_hand_layout = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">왼손 레이아웃</div><div id="custom-left-hand-layout" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑왼손::글씨체') {
                            customFormFieldLeft.custom_left_hand_style = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">왼손 글씨체</div><div id="custom-left-hand-style" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑왼손::자수색상') {
                            customFormFieldLeft.custom_left_hand_text_color = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">왼손 자수 색상</div><div id="custom-left-hand-text-color" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑왼손::obj[선택]' || findTextEl[i].textContent === '커스텀장갑왼손::obj[필수]') {
                            customFormFieldLeft.custom_left_hand_obj = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">왼손::obj</div><div id="custom-left-hand-obj" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑왼손::image[선택]' || findTextEl[i].textContent === '커스텀장갑왼손::image[필수]') {
                            customFormFieldLeft.custom_left_hand_image = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">왼손::이미지</div><div id="custom-left-hand-image" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        }
                    }

                // 오른손 옵션들
                var customTextElRight = '';
                var rightHandLayoutEl = '';
                var rightHandStyleEl = '';
                var rightHandTextColorEl = '';
                var customObjElRight = '';
                var customImageElRight = '';
                var customFormFieldRight = {};

                    for (var i = 0; i < findTextEl.length; i++) {
                        if (findTextEl[i].textContent === '커스텀장갑오른손::텍스트[선택]' || findTextEl[i].textContent === '커스텀장갑오른손::텍스트[필수]') {
                            customTextElRight = findTextEl[i].nextElementSibling.querySelector('input');
                            customFormFieldRight.custom_right_hand_text = customTextElRight.outerHTML.replace(/<td[^>]*>/g, '<div class="item text-item"><div class="item__title">오른손 텍스트</div><div id="custom-right-hand-text" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑오른손::레이아웃') {
                            customFormFieldRight.custom_right_hand_layout = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">오른손 레이아웃</div><div id="custom-right-hand-layout" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑오른손::글씨체') {
                            customFormFieldRight.custom_right_hand_style = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">오른손 글씨체</div><div id="custom-right-hand-style" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑오른손::자수색상') {
                            customFormFieldRight.custom_right_hand_text_color = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item"><div class="item__title">오른손 자수 색상</div><div id="custom-right-hand-text-color" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑오른손::obj[선택]' || findTextEl[i].textContent === '커스텀장갑오른손::obj[필수]') {
                            customFormFieldRight.custom_right_hand_obj = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">오른손::obj</div><div id="custom-right-hand-obj" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        } else if (findTextEl[i].textContent === '커스텀장갑오른손::image[선택]' || findTextEl[i].textContent === '커스텀장갑오른손::image[필수]') {
                            customFormFieldRight.custom_right_hand_image = findTextEl[i].nextElementSibling.outerHTML.replace(/<td[^>]*>/g, '<div class="item hidden"><div class="item__title">오른손::이미지</div><div id="custom-right-hand-image" class="item__contents">').replace(/<\/td>/g, '</div></div>');
                            findTextEl[i].parentNode.parentNode.removeChild(findTextEl[i].parentNode);
                        }
                    }

                // 왼손 커스텀 영역 생성
                var customOptionDivLeft = document.createElement('div');
                var customOptionStrongLeft = document.createElement('strong');
                var customOptionBoxLeft = document.createElement('div');
                
                // 오른손 커스텀 영역 생성
                var customOptionDivRight = document.createElement('div');
                var customOptionStrongRight = document.createElement('strong');
                var customOptionBoxRight = document.createElement('div');

                // 왼손커스텀필드 추가하고 querySelector로 각 텍스트, obj, 이미지 필드를 가져오기
                customOptionBoxLeft.innerHTML = customFormField.custom_left_hand_layout + customFormField.custom_left_hand_style + customFormField.custom_left_hand_text_color + customFormField.custom_left_hand_text + customFormField.custom_left_hand_obj + customFormField.custom_left_hand_image;
                var customTextElLeft = customOptionBoxLeft.querySelector('#custom-text input');
                var customObjElLeft = customOptionBoxLeft.querySelector('#custom-obj input');
                var customImageElLeft = customOptionBoxLeft.querySelector('#custom-image input');


                // 오른손커스텀필드 추가하고 querySelector로 각 텍스트, obj, 이미지 필드를 가져오기
                customOptionBoxRight.innerHTML = customFormField.custom_right_hand_layout + customFormField.custom_right_hand_style + customFormField.custom_right_hand_text_color + customFormField.custom_right_hand_text + customFormField.custom_right_hand_obj + customFormField.custom_right_hand_image;
                var customTextElRight = customOptionBoxRight.querySelector('#custom-text input');
                var customObjElRight = customOptionBoxRight.querySelector('#custom-obj input');
                var customImageElRight = customOptionBoxRight.querySelector('#custom-image input');

                //왼손**customObjElLeft**의 값을 설정하는 코드야. 텍스트가 들어갈 영역, 
                customObjElLeft.value = customInfo.leftHandClipPath.width + '||' + customInfo.leftHandClipPath.height + '||' + customInfo.leftHandClipPath.radius;
                customImageElLeft.value = mockupImage.src; //왼손이미지 필드의 값을 미리보기 이미지의 경로로 설정해서 커스텀 이미지에 반영

                //**읽기 전용(read-only)**설정
                customObjElLeft.readOnly = true;
                customImageElLeft.readOnly = true;


                //오른손**customObjElRight**의 값을 설정하는 코드야. 텍스트가 들어갈 영역,
                customObjElRight.value = customInfo.rightHandClipPath.width + '||' + customInfo.rightHandClipPath.height + '||' + customInfo.rightHandClipPath.radius;
                customImageElRight.value = mockupImage.src; //오른손이미지 필드의 값을 미리보기 이미지의 경로로 설정해서 커스텀 이미지에 반영

                //**읽기 전용(read-only)**설정
                customObjElRight.readOnly = true;
                customImageElRight.readOnly = true;


                //왼손 레이아웃, 스타일, 텍스트 색상 필드 설정
                var customLayoutElLeft = customOptionBoxLeft.querySelector('#custom-layout');
                var customStyleElLeft = customOptionBoxLeft.querySelector('#custom-style');
                var customTextColorElLeft = customOptionBoxLeft.querySelector('#custom-text-color');

                //오른손 레이아웃, 스타일, 텍스트 색상 필드 설정
                var customLayoutElRight = customOptionBoxRight.querySelector('#custom-layout');
                var customStyleElRight = customOptionBoxRight.querySelector('#custom-style');
                var customTextColorElRight = customOptionBoxRight.querySelector('#custom-text-color');

                /*왼손,오른손
                이 코드는 커스텀 옵션을 보여주는 영역을 설정하는 역할을 해. 
                먼저, **제목("커스텀 제작하기")**을 설정하고, 그다음 ID와 클래스를 지정해서 스타일을 적용하거나 특정 동작을 정의할 수 있게 만들어. 
                마지막으로, **옵션 필드를 담는 박스(customOptionBox)**를 전체 영역(customOptionDiv)에 추가해서, 옵션을 화면에 표시할 준비를 완료해.
                이렇게 만든 구조는 최종적으로 사용자가 커스텀 옵션을 볼 수 있는 영역을 만들어 주는 거야. 
                append 각 손의 옵션을 화면에 표시하기 위해 자식 요소로 추가해줘.
                */
                customOptionStrongLeft.textContent = '왼손 커스텀 제작하기';
                customOptionDivLeft.id = 'custom-option-left';
                customOptionDivLeft.className = 'custom-option-list-left';
                customOptionBoxLeft.className = 'custom-option-box-left';
                customOptionDivLeft.append(customOptionStrongLeft);
                customOptionDivLeft.append(customOptionBoxLeft);


                customOptionStrongRight.textContent = '오른손 커스텀 제작하기';
                customOptionDivRight.id = 'custom-option-right';
                customOptionDivRight.className = 'custom-option-list-right';
                customOptionBoxRight.className = 'custom-option-box-right';
                customOptionDivRight.append(customOptionStrongRight);
                customOptionDivRight.append(customOptionBoxRight);

                
                //상품 옵션 테이블에 삽입, 이제 각 손의 커스텀 옵션을 상품 옵션 테이블 뒤에 삽입할 거야.
                var productOptionTableEl = document.querySelector('table.xans-product-option');// 상품 옵션 테이블을 가져와야 해
                productOptionTableEl.parentNode.insertBefore(customOptionDivLeft, productOptionTableEl.nextSibling);
                productOptionTableEl.parentNode.insertBefore(customOptionDivRight, productOptionTableEl.nextSibling);

                // 왼손 텍스트 길이와 미리보기 캔버스 설정
                var customTextLengthLeft = customOptionBoxLeft.querySelector('#custom-text .length');
                var selectorElLeft = document.querySelector('#custom-page-canvas-left');

                // 오른손 텍스트 길이와 미리보기 캔버스 설정
                var customTextLengthRight = customOptionBoxRight.querySelector('#custom-text .length');
                var selectorElRight = document.querySelector('#custom-page-canvas-right');

                //customOptionEl 숨기기,각 손에 맞는 커스텀 옵션 테이블의 특정 행을 숨길 수 있어.
                var customOptionElLeft = document.querySelector('.custom_page_left').closest('tr');
                customOptionElLeft.classList.add('displaynone');

                var customOptionElRight = document.querySelector('.custom_page_right').closest('tr');
                customOptionElRight.classList.add('displaynone');

                // 폰트로딩완료시
                function doActive() {
                    console.log('구글폰트 로딩완료 - GLOVE');

                    // 왼손 커스텀텍스트에디터 생성
                    var customTextEditorLeft = new CustomTextEditor.Editor({
                        target: selectorElLeft, // 왼손 미리보기 캔버스
                        bgImage: mockupImage,
                        customTextEl: customTextElLeft, // 왼손 텍스트 입력 필드
                        spinHandle: spinHandle,
                        clipPath: {
                            width: customInfo.leftHandClipPath.width,
                            height: customInfo.leftHandClipPath.height,
                            radius: customInfo.leftHandClipPath.radius
                        },
                        defaults: {
                            fontFamily: 'Black Han Sans',
                            align: '가운데하단',
                            text: '',
                            color: '#FFFFFF'
                        }
                    }, function () {
                        console.log('왼손 커스텀 에디터 로딩완료');
                    });
                    
                    // 오른손 커스텀텍스트에디터 생성
                    var customTextEditorRight = new CustomTextEditor.Editor({
                        target: selectorElRight, // 오른손 미리보기 캔버스
                        bgImage: mockupImage,
                        customTextEl: customTextElRight, // 오른손 텍스트 입력 필드
                        spinHandle: spinHandle,
                        clipPath: {
                            width: customInfo.rightHandClipPath.width,
                            height: customInfo.rightHandClipPath.height,
                            radius: customInfo.rightHandClipPath.radius
                        },
                        defaults: {
                            fontFamily: 'Black Han Sans',
                            align: '가운데하단',
                            text: '',
                            color: '#FFFFFF'
                        }
                    }, function () {
                        console.log('오른손 커스텀 에디터 로딩완료');
                    });
                    
                    /*
                    * ----------------------------------------------------------------
                    * 이벤트 할당
                    * ----------------------------------------------------------------
                    */

                    /**
                     * 텍스트 필드가 채워질때
                     * Lodash를 이용하여 입력시간 이벤트를 지연한다.
                     */
                    // 텍스트 필드가 채워질 때 (왼손)
                    customTextElLeft.addEventListener('keyup', _.debounce(function (e) {
                        customTextEditorLeft.setText(this.value); // 왼손 커스텀 에디터에 텍스트 설정
                    }, 300));

                    // 텍스트 레이아웃 선택 시 (왼손)
                    if (customLayoutElLeft) {
                        customTextEditorLeft.addEvent(customLayoutElLeft, 'click', 'custom_layout');
                    }

                    // 텍스트 스타일 선택 시 (왼손)
                    if (customStyleElLeft) {
                        customTextEditorLeft.addEvent(customStyleElLeft, 'click', 'custom_font');
                    }

                    // 텍스트 색상 선택 시 (왼손)
                    if (customTextColorElLeft) {
                        customTextEditorLeft.addEvent(customTextColorElLeft, 'click', 'custom_font_color');
                    }


                    // 텍스트 필드가 채워질 때 (오른손)
                    customTextElRight.addEventListener('keyup', _.debounce(function (e) {
                        customTextEditorRight.setText(this.value); // 오른손 커스텀 에디터에 텍스트 설정
                    }, 300));

                    // 텍스트 레이아웃 선택 시 (오른손)
                    if (customLayoutElRight) {
                        customTextEditorRight.addEvent(customLayoutElRight, 'click', 'custom_layout');
                    }

                    // 텍스트 스타일 선택 시 (오른손)
                    if (customStyleElRight) {
                        customTextEditorRight.addEvent(customStyleElRight, 'click', 'custom_font');
                    }

                    // 텍스트 색상 선택 시 (오른손)
                    if (customTextColorElRight) {
                        customTextEditorRight.addEvent(customTextColorElRight, 'click', 'custom_font_color');
                    }


                    /*
                    * ----------------------------------------------------------------
                    * 반응형 관련
                    * ----------------------------------------------------------------
                    */

                    /**
                     * RESIZE 관련 기능
                     */
                    (function () {
                        window.addEventListener('resize', resizeThrottler, false);

                        var resizeTimeout;
                        function resizeThrottler() {
                            // ignore resize events as long as an actualResizeHandler execution is in the queue
                            if (!resizeTimeout) {
                                resizeTimeout = setTimeout(function () {
                                    resizeTimeout = null;
                                    actualResizeHandler();

                                    // The actualResizeHandler will execute at a rate of 15fps
                                }, 66);
                            }
                        }

                        function actualResizeHandler() {
                            // handle the resize event
                            customTextEditorLeft.resizeCanvasZoom(selectorElLeft.offsetWidth, selectorElLeft.offsetHeight); //왼손
                            customTextEditorRight.resizeCanvasZoom(selectorElRight.offsetWidth, selectorElRight.offsetHeight);//오른손


                        }
                    }());
                }
            } // End 폰트로딩완료


        } // 해당상품이 커스텀페이지 일경우
    };

    mockupImage.onerror = function() {
        console.error('이미지를 로드하는 데 실패했습니다.');
        return;
    };

});