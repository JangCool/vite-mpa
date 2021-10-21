/* eslint-disable no-unused-vars */
/**
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */

/*!
 * Check if an item is a plain object or not
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Object}  obj  The item to check
 * @return {Boolean}      Returns true if the item is a plain object
 */
var isPlainObject = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

/*!
 * Serialize all form data into an array of key/value pairs
 * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {Array}       The serialized form data
 */
var serializeArray = function (form) {
    var arr = [];
	Array.prototype.slice.call(form.elements).forEach(function (field) {
		if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
		if (field.type === 'select-multiple') {
			Array.prototype.slice.call(field.options).forEach(function (option) {
				if (!option.selected) return;
				arr.push({
					name: field.name,
					value: option.value
				});
			});
			return;
		}
		if (['checkbox', 'radio'].indexOf(field.type) >-1 && !field.checked) return;
		arr.push({
			name: field.name,
			value: field.value
		});
    });
	return arr;
};

var patterns = {
    //    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    validate: /^[a-z][a-z0-9_]*(?:\.?\[?[a-z0-9_]*\]?)*(?:\[[0-9]+\])?$/i, //new name[0].value 형식 추가. 장진철
    key: /[a-z0-9_]+|(?=\[\])/gi,
    push: /^$/,
    fixed: /^\d+$/,
    named: /^[a-z0-9_]+$/i
};

function FormSerializer(form) {

    // private variables
    var data = {},
        pushes = {};

    // private API
    function build(base, key, value) {
        base[key] = value;
        return base;
    }

    function makeObject(root, value) {

        var keys = root.match(patterns.key),
            k;

        // nest, nest, ..., nest
        while ((k = keys.pop()) !== undefined) {
            // foo[]
            if (patterns.push.test(k)) {
                var idx = incrementPush(root.replace(/\[\]$/, ''));
                value = build([], idx, value);
            }

            // foo[n]
            else if (patterns.fixed.test(k)) {
                value = build([], k, value);
            }

            // foo; foo[bar]
            else if (patterns.named.test(k)) {
                value = build({}, k, value);
            }
        }

        return value;
    }

    function incrementPush(key) {
        if (pushes[key] === undefined) {
            pushes[key] = 0;
        }
        return pushes[key]++;
    }

    function encode(pair) {
        switch (form.querySelector('[name="' + pair.name + '"]').type) {
            case "checkbox":
                return pair.value === "on" ? true : pair.value;
            default:
                return pair.value;
        }
    }

    function addPair(pair) {
        if (!patterns.validate.test(pair.name)) return this;
        var obj = makeObject(pair.name, encode(pair));
        data =  Object.assign(data, obj);
        return this;
    }

    function addPairs(pairs) {
        if (!Array.isArray(pairs)) {
            throw new Error("formSerializer.addPairs expects an Array");
        }
        for (var i = 0, len = pairs.length; i < len; i++) {
            this.addPair(pairs[i]);
        }
        return this;
    }

    function serialize() {
        return data;
    }

    function serializeJSON() {
        return JSON.stringify(serialize());
    }

    // public API
    this.addPair = addPair;
    this.addPairs = addPairs;
    this.serialize = serialize;
    this.serializeJSON = serializeJSON;
}

FormSerializer.patterns = patterns;

FormSerializer.serializeObject = function serializeObject(selector) {
    var form = document.querySelector(selector);
    return new FormSerializer(form).
    addPairs(serializeArray(form)).
    serialize();
};

FormSerializer.serializeFiles = function serializeObject(selector) {
    
    if(!window.File || !window.FormData){
        console.error("File 또는 FormFile 객체를 지원하지 않아 해당 함수를 사용할 수 없습니다.");
        return;
    }
    
    var form = document.querySelector(selector);
    var inputFiles = form.querySelector('input[type=file]');
    var arrayParam = serializeArray(form);
    console.log(form, inputFiles)

    if(inputFiles){

         // eslint-disable-next-line no-unused-vars
        inputFiles.forEach(function(tag, tagIndex) {
            // eslint-disable-next-line no-unused-vars
            tag.files.forEach(function(file, fileIndex) {
                arrayParam.push({
                    name: tag.name,
                    value: file
                });
            });
        });
    }


    // $.each($inputFiles, function(i, tag) {
    //     $.each($(tag)[0].files, function(i, file) {
    //         arrayParam.push({
    //             name: tag.name,
    //             value: file
    //         });
    //     });
    // });
    
    return new FormSerializer(form).
    addPairs(arrayParam).
    serialize();
};

FormSerializer.serializeJSON = function serializeJSON(selector) {
    var form = document.querySelector(selector);
    return new FormSerializer(form).
    addPairs(serializeArray(form)).
    serializeJSON();
};


//" " 공백을 %20으로 치환.
var r20 = /%20/g,
rbracket = /\[\]$/,
rCRLF = /\r?\n/g,
rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
rsubmittable = /^(?:input|select|textarea|keygen)/i,
rIdentifier = /^[$A-Z_][0-9A-Z_$]*$/i;

var _param = function( form, traditional, dotNotation, targetObject ) {
    
    if((form instanceof FormData)){
        return form;
    }
    
    //파라메터 값을 저장할 객체가 FormData인지 판단한다.
    var isFormData = (targetObject instanceof FormData);
    
    var prefix,
        s = targetObject,
        add = function( key, value ) {
            // If value is a function, invoke it and return its value
            //FormData일 경우 객체값 그대로 집어 넣는다.
            if(isFormData){
                //formdata 일 경우 null 값일 경우 '' 공백 처리되어 전송 된다. multipart일 경우에는 null 문자열 자체가 넘어가기 때문에 null값일 경우 무조건 공백 처리한다.''
                s.append(key, value || '')
            } else {
                console.log(key, value)
                value = typeof( value ) == "function" ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );				
            }

        };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
        traditional = false;
    }
    if ( dotNotation === undefined ) {
        dotNotation = true;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( Array.isArray( form ) || !isPlainObject( form ) ) {

        // Serialize the form elements
        form.forEach(function(element, tagIndex) {
            add( element.name, element.value );
        });

    } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for ( prefix in form ) {
            buildParams( prefix, form[ prefix ], traditional, dotNotation, add );
        }
    }

    // Return the resulting serialization
    return (isFormData) ? s : s.join( "&" ).replace( r20, "+" );
};

/**
 * 일반 문자열 파라메터 처리.
 * 4번째 매개변수에 배열을 넣어준다.
 */
var param = function( form, traditional, dotNotation ) {
    
    if(typeof(form) == "string"){
        form = FormSerializer.serializeArray(form);
    }
    
    return _param( form, traditional, dotNotation, []);
}

/**
 * FormData 파라메터 처리.
 * 4번째 매개변수에 FormData를 넣어준다.
 */
var paramFiles = function( form, traditional, dotNotation ) {
    
    if(!window.File || !window.FormData){
        console.error("File 또는 FormFile 객체를 지원하지 않아 해당 함수를 사용할 수 없습니다.");
        return;
    }
    

    if(typeof(selector) == "string"){
        form = new FormData(document.querySelector(form));
    }
    
    return _param( form, traditional, dotNotation, new FormData());
};

function buildParams( prefix, obj, traditional, dotNotation, add ) {
    var name;

    if ( Array.isArray( obj ) ) {
        // Serialize array item.
        obj.forEach(function(v, i) {

            if ( traditional || rbracket.test( prefix ) ) {
                // Treat each array item as a scalar.
                add( prefix, v );

            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                // buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, dotNotation, add ); //old 
                // [] 처리 없이 [0] 처럼 index번호를 부여한다.	
                buildParams( prefix + "[" + (i) + "]", v, traditional, dotNotation, add );
            }
        });

    } else if ( !traditional && typeof( obj ) === "object" && !(obj instanceof File) ) {
        // Serialize object item.
        for ( name in obj ) {
            if( dotNotation && rIdentifier.test(name) ) {
                buildParams( prefix + '.' + name, obj[name], traditional, dotNotation, add )
            } else {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, dotNotation, add );
            }
        }

    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

var serializeObject = FormSerializer.serializeObject;
var serializeFiles = FormSerializer.serializeFiles;
var serializeJSON = FormSerializer.serializeJSON;

export {
    serializeObject,
    serializeFiles,
    serializeJSON,
    paramFiles,
    param
}
