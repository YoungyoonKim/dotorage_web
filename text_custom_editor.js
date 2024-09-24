/**
 * 커스텀 텍스트 프로그램 v1.0.1 (2021-09-03)
 * 커스텀해시 카페24 상품 텍스트 커스텀 에디터
 * (c) 2021 Hashcorp.
 * 디자인 및 코드 무단복사시 법적 제제를 받을 수 있습니다.
 *
 * @version 1.0.0
 * @제작자 : 박세헌 - manager@hashcorp.kr
 * @연락처 : 010-5738-3314 [해시코퍼레이션]
 *
 * @최초생성일 : 2021-01-26
 * @최초생성일 : 2021-08-04
 *
 * @수정사항
 * ----------------------
 * 2021-08-04 : 프로그램 최초 생성
 * 2021-09-03 : 패턴 만들기 연산 성능 업그레이드
 *
 * @namespace CustomTextEditor
 **/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser global
        root.CustomTextEditor = factory();
    }
}(this, function () {
    'use strict'

    const CustomTextEditor = function () {
        console.info('%c/** -------------------------------------------------------------------------------- **/', 'color:#ff0000;');
        console.info('%c해시코퍼레이션', 'color: #ff0000; font-size:48px; font-weight:bold');
        console.info('%c* 프로그램 : 카페24 커스텀프로그램\n* Ver : 1.0.1\n* 개발자 : 박세헌\n* 프로그램 기능추가 및 튜닝 문의 : manager@hashcorp.kr', 'color: rgb(0, 0, 0); font-size: 14px');
        console.info('%c/** -------------------------------------------------------------------------------- **/', 'color:#ff0000;');
    };

    CustomTextEditor.version = '1.0.1';
    CustomTextEditor();

    // TODO


    // 전역 상수
    const
        CANVAS_NAME = 'custom-canvas',
        CENTER_BOTTOM_MARGIN = 20,
        BOTTOM_MARGIN = 50,
        FONT_SIZE = 60,
        MIN_FONT_SIZE = 40,
        MAX_FONT_SIZE = 180,
        COLOR_WHITE = '#FFFFFF',
        COLOR_BLACK = '#000000';



    /**
     * 카페24 상세페이지 내 텍스트 커스텀 에디터
     *
     * @class
     *
     * @require - fabricjs,
                      loading_spinner
     *
     * @example
     * @기본 사용방법
     * new CustomTextEditor.Editor();
     *
     * 파라미터와 함께 사용하는 방법
       const customTextEditor = new CustomTextEditor.Editor({
            mode : 'export' or 'editor',
            id : resultObj.id,
            name : resultObj.name,
            target: target,
            bgImage: bgImage,
            customTextEl : customTextEl,
            spinHandle : spinHandle,
            clipPath: {
                width : width,
                height : height,
                radius : radius
            },
            mask: {
                width: width,
                height: height,
                x: x,
                y: y,
                radius: radius
            },
            defaults: {
                fontFamily : 'Black Han Sans',
                align : '가운데하단',
                text : '',
                color : COLOR_WHITE
            }
        }, callback() );
     *
     *
     * @param {object} [options] - 에디터 초기 세팅을 위한 파라미터 옵션, 지속적으로 업데이트 예정
                                       에디터가 추가될 때 각 초기값으로 활용된다.
     *
     */
    CustomTextEditor.Editor = function (options, callback) {
        /*
         * ----------------------------------------------------------------
         * 상수 초기화
         * ----------------------------------------------------------------
         */
        const
            NAMESPACE = 'CustomTextEditor.Editor',
            DEFAULT_OPTIONS = Editor_OPTIONS.defaults;

        /*
         * ----------------------------------------------------------------
         * private 변수 초기화
         * ----------------------------------------------------------------
         */
        const
            Editor = this,
            _mode = options.mode || {},
            _id = options.id || {},
            _name = options.name || {},
            _target = options.target || { offsetWidth: 1024, offsetHeight: 1024 },
            _bgImage = options.bgImage || {},
            _options = _util.extend({}, DEFAULT_OPTIONS, options.defaults),
            _customTextEl = options.customTextEl || {},
            _objects = {},
            _variables = {};
        let
            _spinHandle = options.spinHandle || {},
            _secondSpinHandle = '';




        /*
         * ----------------------------------------------------------------
         * private functions
         * ----------------------------------------------------------------
         */

        /**
         * 초기 init 함수
         * @private
         */
        const construct = function () {
            
            _variables.isDefault = true;
            _variables.isPattern = false;
            _variables.offsetWidth = _target.offsetWidth;
            _variables.offsetHeight = _target.offsetHeight;
            _variables.maxWidth = _bgImage.naturalWidth
            _variables.maxHeight = _bgImage.naturalHeight;
            _variables.centerLeft = _variables.maxWidth / 2;
            _variables.centerTop = _variables.maxHeight / 2;
            _variables.clipPathWidth = parseInt(options.clipPath.width);
            _variables.clipPathHeight = parseInt(options.clipPath.height);
            _variables.clipPathRadius = parseInt(options.clipPath.radius);
            _variables.clipPathLeft = _variables.centerLeft - _variables.clipPathWidth / 2;
            _variables.clipPathTop = _variables.centerTop - _variables.clipPathHeight / 2;
            
            console.log(_variables.centerTop);
            console.log(_variables.clipPathHeight);
            
            /*
            _variables.clipMaskWidth = parseInt(options.mask.width);
            _variables.clipMaskHeight = parseInt(options.mask.height);
            _variables.clipMaskX = parseInt(options.mask.x);
            _variables.clipMaskY = parseInt(options.mask.y);
            _variables.clipMaskRadius = parseInt(options.mask.radius);
            */


            // 캔버스 Element 생성
            _objects.canvasEl = document.createElement('canvas');
            _objects.canvasEl.id = CANVAS_NAME;
            if (_mode !== 'export') _target.append(_objects.canvasEl);

            // fabric 캔버스 초기화
            _objects.canvas = new fabric.StaticCanvas(CANVAS_NAME, {
                width: _variables.maxWidth,
                height: _variables.maxHeight,
                backgroundColor: COLOR_WHITE,
                zoom: 1,
            });

            // CLIPPATH 초기화
            _objects.clipPath = new fabric.Rect({
                width: _variables.clipPathWidth,
                height: _variables.clipPathHeight,
                left: _variables.clipPathLeft,
                top: _variables.clipPathTop,
                rx: _variables.clipPathRadius,
                ry: _variables.clipPathRadius,
                fill: 'green',
                absolutePositioned: true,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                selectable: false,
            });
            
            console.log(_objects.clipPath);

            // MASK 초기화
            /*
            _objects.mask = new fabric.Rect({
                width: _variables.clipMaskWidth,
                height: _variables.clipMaskHeight,
                left: _variables.clipPathLeft + _variables.clipMaskX,
                top: _variables.clipPathTop + _variables.clipMaskY,
                rx: _variables.clipMaskRadius,
                ry: _variables.clipMaskRadius,
                fill: 'red',
                absolutePositioned: true,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                selectable: false,
            });
            */

            // 커스텀텍스트 초기화
            _objects.customText = new fabric.IText(_options.text, {
                index: 1000,
                id: 'custom_text',
                name: 'custom_text',
                fontFamily: _options.fontFamily,
                fontWeight: 'normal',
                fontSize: FONT_SIZE,
                top: _variables.clipPathHeight - CENTER_BOTTOM_MARGIN,
                left: _variables.centerLeft,
                width: _variables.clipPathWidth,
                originX: 'center',
                originY: 'center',
                textAlign: 'center',
                angle: 0,
                padding: 0,
                lineHeight: 1,
                fill: _options.color,
                clipPath: _objects.clipPath,
                enableRetinaScaling: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                selectable: false,
                absolutePositioned: true,
                objectCaching: false,
                styles: {
                    align: _options.align,
                    font: _options.fontFamily,
                    color: _options.color,
                },
            });

            // 배경이미지 초기화
            Editor.setBackgroundImage(_bgImage.src);
        }

        /**
         * 로딩 Spinner 멈추기
         * @private
         */
        const stopSpinner = function (sel, timer) {
            _objects.canvas.requestRenderAll();
            setTimeout(function () {
                _objects.canvas.requestRenderAll();
                loadingOverlay().cancel(sel);
            }, timer);
        }

        /**
         * 캔버스 오브젝트 삭제 기능
         * @private
         */
        const removeFindObject = function (objName) {
            _objects.canvas.getObjects().forEach(function (o) {
                if (o.id === objName) {
                    _objects.canvas.remove(o);
                }
            })
            _objects.canvas.requestRenderAll();
        }


        /**
         * 마스크생성 함수
         * @private
         */
        const createMask = function () {

            let _canvas = document.createElement('canvas');
            _canvas.id = 'save-canvas';
            let saveCanvas = new fabric.StaticCanvas('save-canvas');
            saveCanvas.setWidth(_variables.maxWidth);
            saveCanvas.setHeight(_variables.maxHeight);

            setTimeout(function () {
                const json = JSON.stringify(_objects.canvas.toJSON());
                saveCanvas.loadFromJSON(json, function () {
                    console.log('이미지 저장중');

                    if (_variables.isDefault) _variables.isDefault = !_variables.isDefault;

                    // 에디터용일 경우
                    if (_mode !== 'export') {
                        stopSpinner(_spinHandle, 0);
                        callback();
                    }
                    // 미리보기용일 경우
                    else {
                        exportCanvas(100);
                    }
                });
                _canvas = null;
            }, 500);
        }

        /**
         * 특수문자 검색기
         * @private
         */
        const characterCheck = function (val) {
            const RegExp = /[!?%^&*():;+=~{}<>\-\_\[\]\|\\\"\'\,\.\/\`\₩]/gi; //정규식 구문
            if (RegExp.test(val)) {
                alert('해당 특수문자는 입력하실 수 없습니다.');
                _customTextEl.value = val.substring(0, val.length - 1); //특수문자를 지우는 구문
            }
            return _customTextEl.value;
        }

        /**
         * 텍스트 정렬 체크
         * @private
         */
        const checkTextAlign = function () {
            let textValue = _objects.customText.styles.align;
            if (textValue === '우측하단' || textValue === 'alignRightBottom') textValue = 'alignRightBottom';
            return textValue !== 'alignRightBottom';
        }

        /**
         * 텍스트 길이 체크
         * @private
         */
        const checkTextLength = function () {
            return _objects.customText.text.length < 5;
        }


        /**
         * 길이에 따른 텍스트 조정
         * @private
         *
         */
        const adjustText = function () {
            if (checkTextAlign()) {
                if (checkTextLength() || _variables.isPattern) _objects.customText.fontSize = FONT_SIZE;
                else _objects.customText.fontSize = FONT_SIZE; //MIN_FONT_SIZE를 FONT_SIZE;로 변경
            } else {
                _objects.customText.fontSize = MAX_FONT_SIZE;
            }
            if (!_variables.isPattern) _objects.canvas.renderOnAddRemove = true;
            _objects.canvas.requestRenderAll();
            setTimeout(function () {
                _objects.canvas.requestRenderAll();
            }, 300);

        }

        /**
         * 배경이미지(목업) 변경
         * @private
         *
         */
        const changeBackground = function (src) {
            return function () {
                //console.log('배경이미지 변경', src);
                if (!_variables.isDefault) _spinHandle = loadingOverlay().activate();
                _objects.canvas.overlayImage = null;
                _objects.canvas.clear();
                Editor.setBackgroundImage(src);
                adjustText();
                createMask();
            }
        }

        /**
         * 폰트 변경
         * @private
         *
         */
        const changeFontStyle = function (fontFamily) {
            return function () {
                console.log('폰트변경');
                _objects.customText.fontFamily = fontFamily;
                _objects.customText.fontWeight = 'normal';
                _objects.customText.styles.font = fontFamily;
                adjustText();
                _objects.canvas.requestRenderAll();

                // 패턴일경우 패턴으로 전환
                if (_variables.isPattern) makePatternText();
            }
        }

        /**
         * 폰트컬러 변경
         * @private
         *
         */
        const changeFontColor = function (color) {
            return function () {
                //console.log('폰트컬러 변경');
                const _color = color.toUpperCase();
                _objects.customText.fill = _color;
                _objects.customText.styles.color = _color;
                adjustText();
                _objects.canvas.requestRenderAll();

                // 패턴일경우 패턴으로 전환
                if (_variables.isPattern) makePatternText();
            }
        }


        /**
         * TEXT 리셋
         * @private
         */
        const resetCustomText = function () {
            _objects.customText.text = _customTextEl.value;
            _objects.customText.angle = 0;
            _objects.customText.fontSize = FONT_SIZE;
            _objects.customText.lineHeight = 1;
            _objects.customText.padding = 0;
            _objects.customText.textAlign = 'center';
            _objects.customText.originX = 'center';
            _objects.customText.originY = 'center';
            _objects.customText.left = _variables.centerLeft;
            _objects.customText.top = _variables.centerTop;
            _objects.customText.styles.align = _options.align;
        }

        /**
         * 텍스트 기본설정으로 출력
         * @private
         */
        const defaultSettingText = function () {
            switch (_options.align) {
                case '가운데':
                    alignCenterText();
                    break;
                case '우측하단':
                    alignRightBottomText();
                    break;
                case '패턴':
                    makePatternText();
                    break;
                case '가운데하단':
                default:
                    alignBottomCenterText();
                    break;
            }
        }

        /**
         * 텍스트 하단가운데 정렬
         * @private
         */
        const alignBottomCenterText = function () {
            
            console.log('하단가운데');
            console.log(_customTextEl.value);
            
            _variables.isPattern = false;
            _objects.canvas.remove(_objects.customText);
            _objects.canvas.add(_objects.customText);
            _objects.customText.text = _customTextEl.value;
            _objects.customText.angle = 0;
            _objects.customText.fontSize = FONT_SIZE;
            _objects.customText.lineHeight = 1;
            _objects.customText.padding = 0;
            _objects.customText.textAlign = 'center';
            _objects.customText.originX = 'center';
            _objects.customText.originY = 'top';

            _objects.customText.left = _variables.centerLeft + 35; //하단 중앙에서 오른쪽으로 35픽셀 이동
			_objects.customText.top = _variables.clipPathHeight + (1024 - _variables.clipPathHeight) / 4 - 220; 
            
            console.log(_objects.customText.left);
            console.log(_objects.customText.top);

            _objects.customText.styles.align = '가운데하단';
            removeFindObject('custom_text_pattern');
            adjustText();
            _objects.canvas.requestRenderAll();
        }

        /**
         * 텍스트 정가운데 정렬
         * @private
         */
        const alignCenterText = function () {
            //console.log(_customTextEl.value);
            _variables.isPattern = false;
            _objects.canvas.remove(_objects.customText);
            _objects.canvas.add(_objects.customText);
            _objects.customText.text = _customTextEl.value;
            _objects.customText.angle = 0;
            _objects.customText.fontSize = FONT_SIZE;
            _objects.customText.lineHeight = 1;
            _objects.customText.padding = 0;
            _objects.customText.textAlign = 'center';
            _objects.customText.originX = 'center';
            _objects.customText.originY = 'center';
			_objects.customText.left = _variables.centerLeft + 40; //중앙에서 오른쪽으로 40픽셀 이동
			_objects.customText.top = _variables.centerTop + 70;  // 중앙 위에서 아래로 70픽셀
            _objects.customText.styles.align = '가운데';
            removeFindObject('custom_text_pattern');
            adjustText();
            _objects.canvas.requestRenderAll();
        }

        /**
         * 텍스트 우측하단 정렬
         * @private
         */
        const alignRightBottomText = function () {
            const CUSTOM_WIDTH = 200;
            const CUSTOM_TOP = 70;

            _variables.isPattern = false;
            _objects.canvas.remove(_objects.customText);
            _objects.canvas.add(_objects.customText);
            _objects.customText.text = _customTextEl.value;
            _objects.customText.lineHeight = 1;
            _objects.customText.padding = 0;
            _objects.customText.textAlign = 'left';
            _objects.customText.originX = 'left';
            _objects.customText.originY = 'top';
            _objects.customText.left = _variables.clipPathWidth + (1024 - _variables.clipPathWidth) / 4 - 50;
			_objects.customText.top = _variables.clipPathHeight + (1024 - _variables.clipPathHeight) / 4;

            _objects.customText.angle = 270;
            _objects.customText.fontSize = 180;
            _objects.customText.styles.align = '우측하단';
            removeFindObject('custom_text_pattern');
            adjustText();
            _objects.canvas.requestRenderAll();
        }

        /**
         * 그룹생성
         * @private
         */
        const makeGroup = function (objs, objTop, objLeft, objAngle) {
            const alltogetherObj = new fabric.Group(objs, {
                id: 'custom_text_pattern',
                name: 'custom_text_pattern',
                top: objTop,
                left: objLeft,
                originX: 'center',
                originY: 'center',
                angle: objAngle,
                clipPath: _objects.clipPath,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,     // 회전은 잠금
                selectable: false,
                absolutePositioned: true,
            });
            
           
            return alltogetherObj;
        }

        /**
         * 패턴만들기
         * @private
         */
        const makePatternText = function () {
            //console.log('패턴생성');

            _secondSpinHandle = loadingOverlay().activate();

            const PATTERN_HORIZON = 25;
            const PATTERN_VERTICAL = 20;
            const PATTERN_SPACING = 22;

            let pattern_top = 0;
            let pattern_left = 0;
            let textObjects = [];

            resetCustomText();
            _variables.isPattern = true;
            _objects.canvas.renderOnAddRemove = false;
            _objects.customText.styles.align = '패턴';

            adjustText();

            for (let i = 0; i < PATTERN_HORIZON * PATTERN_VERTICAL; i++) {

                if (_objects.customText.text === '') {
                    //console.log('비었음');
                    break;
                }

                const tempText = new fabric.IText(_objects.customText.text, {
                    fontFamily: _objects.customText.fontFamily,
                    angle: 0,
                    padding: 0,
                    lineHeight: 1,
                    fontWeight: 'normal',
                    fontSize: FONT_SIZE,
                    top: _variables.clipPathHeight - BOTTOM_MARGIN,
                    left: _variables.centerLeft,
                    width: _variables.clipPathWidth,
                    originX: 'center',
                    originY: 'center',
                    textAlign: 'center',
                    fill: _objects.customText.fill,
                    clipPath: _objects.clipPath,
                    enableRetinaScaling: false,
                    lockMovementX: true,
                    lockMovementY: true,  
                    lockRotation: true,
                    selectable: false,
                    absolutePositioned: true,
                    objectCaching: false,
                });

                if (i % PATTERN_HORIZON === 0) {
                    pattern_left = 0;
                    pattern_top += tempText.height - PATTERN_SPACING;
                }

                pattern_left += tempText.width;

                if (i % 2 === 0) {
                    tempText.top = pattern_top;
                    tempText.left = pattern_left;
                    textObjects.push(tempText);
                }
            }

            // console.log('텍스트오브젝트 삭제함');
            removeFindObject('custom_text_pattern');
            _objects.canvas.remove(_objects.customText);
            _objects.canvas.add(makeGroup(textObjects, _variables.centerTop, _variables.centerLeft, 15));
            stopSpinner(_secondSpinHandle, 500);
        }

        /**
         * 활성화 옵션 체크
         * @private
         *
         * 고차함수로 실행됨
         */
        const updateOption = function (element, predicate, evt) {
            if (!element.classList.contains('ec-product-selected') && !element.classList.contains('ec-product-disabled')) {
                //console.log('고차함수 실행');
                return predicate();
            } else {
                //console.log('preventDefault');
                evt.preventDefault();
                evt.stopPropagation();
            }
        }

        /**
         * base64 주소 blob으로 변경
         * @private
         *
         */
        const base64toBlob = function (base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data.replace(/^data:image\/(png|jpg);base64,/, ''));
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }

        /**
         * 미리보기용 이미지 출력
         * @private
         *
         */
        const exportCanvas = function (timer) {
            defaultSettingText();
            const render = _objects.canvas.toDataURL({
                format: 'png',
                multiplier: 1,
                enableRetinaScaling: false,
                width: _variables.maxWidth,
                height: _variables.maxHeight,
                left: 0,
                top: 0,
            });
            var blob = base64toBlob(render, 'image/png');
            var blobUrl = URL.createObjectURL(blob);

            setTimeout(function () {
                const img = new Image();
                img.src = blobUrl;

                img.onload = function () {
                    callback(this.src);
                    //URL.revokeObjectURL(blobUrl);
                };
            }, timer);
        }

        function CheckIE() {
            const Browser = navigator.userAgent;
            if (Browser.indexOf('Trident') == -1) {
                //WHATHEVER YOU WANT IF IT IS NOT INTERNET EXPLORER
                return false;
            } else {
                alert('서비스를 정상적으로 이용하기 위해\n크롬브라우저, Edge, 네이버 웨일, 사파리, 파이어폭스 같은 최신 브라우저가 필요합니다.\n또는 모바일웹에서 실행해주세요.');
                return true;
            }
        }

        /*
         * ----------------------------------------------------------------
         * public functions
         * ----------------------------------------------------------------
         */

        /**
         * 캔버스 Zoom 세팅
         * @public
         */
        this.resizeCanvasZoom = function (_width, _height) {
            _objects.canvas.setWidth(_width);
            _objects.canvas.setHeight(_height);
            _objects.canvas.setZoom(_width / _variables.maxWidth);
        }

        /**
         * 배경이미지 세팅 함수
         * @public
         */
        this.setBackgroundImage = function (src) {
            
            console.log('배경이미지', src);
            
            _objects.canvas.setBackgroundImage(src, _objects.canvas.requestRenderAll.bind(_objects.canvas), {
                opacity: 1,
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top',
                crossOrigin: 'anonymous',
            });
                
        }

        /**
         * 커스텀 텍스트 변경 기능
         * public
         */
        this.setText = function (val) {
            const pureText = characterCheck(val);
            _objects.customText.text = pureText;
            adjustText();

            // 패턴일경우 패턴으로 전환
            if (_variables.isPattern) makePatternText();
        }

        /**
         * 이벤트 연결함수
         * public
         */
        this.addEvent = function (target, eventName, state, returnValue) {
            switch (state) {
                case 'custom_color':
                    target.addEventListener('click', function (e) {
                        const li = e.target.closest('li');
                        if (!li) return;
                        updateOption(li, changeBackground(li.querySelector('img').src), e);
                        const _returnValue = returnValue();
                        if (_returnValue[0]) _returnValue[0].src = li.querySelector('img').src;
                        if (_returnValue[1]) _returnValue[1].value = li.querySelector('img').src;
                    });
                    break;
                case 'custom_layout':
                    target.addEventListener('click', function (e) {
                        const li = e.target.closest('li');
                        if (!li) return;

                        const optionTitle = li.title.toUpperCase();

                        if (optionTitle === '가운데' || optionTitle === 'CENTER') {
                            updateOption(li, alignCenterText, e);
                        } else if (optionTitle === '우측하단' || optionTitle === 'RIGHT BOTTOM') {
                            updateOption(li, alignRightBottomText, e);
                        } else if (optionTitle === '패턴' || optionTitle === 'PATTERN') {
                            updateOption(li, makePatternText, e);
                        } else {
                            updateOption(li, alignBottomCenterText, e);
                        }
                    });
                    break;
                case 'custom_font':
                    target.addEventListener('click', function (e) {
                        const li = e.target.closest('li');
                        if (!li) return;
                        updateOption(li, changeFontStyle(li.title), e);
                    });
                    break;
                case 'custom_font_color':
                    target.addEventListener('click', function (e) {
                        const li = e.target.closest('li');
                        if (!li) return;
                        updateOption(li, changeFontColor(li.title), e);
                    });
                    break;
                default:
                    break;
            }
            return this;
        }

        // INIT
        construct();
        this.resizeCanvasZoom(_variables.offsetWidth, _variables.offsetHeight);
        
        createMask();


        return Editor;
    }




    /**
     * 기본값 할당
     */
    const Editor_OPTIONS = {
        defaults: {
            fontFamily: 'Black Han Sans',
            align: '가운데하단',
            text: '',
            color: COLOR_WHITE
        }
    };

    /**
     * Editor 관련 옵션추가
     */
    CustomTextEditor.Editor.addOption = function (name, defaultValue) {
        Editor_OPTIONS.defaults[name] = defaultValue;
    };


    /**
     * 개발 관련된 유틸리티 함수들
     *
     * TODO: DOCS (private for dev)
     *
     */
    const _util = CustomTextEditor._util = (function (window) {
        const U = {};

        // extend obj – same as jQuery.extend({}, objA, objB)
        U.extend = function (obj) {
            obj = obj || {};
            for (let i = 1; i < arguments.length; i++) {
                if (!arguments[i]) {
                    continue;
                }
                for (let key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        obj[key] = arguments[i][key];
                    }
                }
            }
            return obj;
        };

        return U;
    }(window || {}));



    return CustomTextEditor;
}));