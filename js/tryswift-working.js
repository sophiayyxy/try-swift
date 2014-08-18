var maxPage = -1;
var currentPage = 1;
var prev, next, topics; // buttons
var index; // examples
var maxPage;

var editor = ace.edit("editor");
editor.setFontSize('14px');
editor.setTheme("ace/theme/KatzenMilch");
editor.getSession().setMode("ace/mode/text");

function numConvert(n) {
	return n < 10? "0" + n: n;
}

function setVisiblePage(n) {
  var examples = document.getElementsByClassName('example');
  for(var i=0; i < examples.length; i++) {
    var page = examples[i];
    page.classList.add('hidden');
  }
  var visiblePage = document.getElementById('page-' + numConvert(n));
  visiblePage.classList.remove('hidden');
}

function setEditorPage(n) {
	var i = numConvert(n);
	$.get("scripts/" + i + "-source.txt", function(data) {
		//$("div#source-" + i).html(data);
		editor.setValue(data, -1);
	});
	//editor.setValue($('#source-01').text(), -1);
	// var source = document.createElement('div');
	// source.id = 'source-' + i;
	// source.className = 'sourceToHide';
	// document.getElementById('page-'+i).appendChild(source);
	// $.get("scripts/" + i + "-source.txt", function(data) {
	// 	//alert(data);
	// 	$("div#source-" + i).html(data);
	// 	alert($('#source-01').text());
	// });
}

function hideFiles() {
    document.getElementById('outputs').innerHTML = "<option>File outputs</option>";
    $('#outputs').hide();
}

function check_buttons() {
	$('#topics').val(index[currentPage-1]);
	if (currentPage == maxPage) {
	    next.setAttribute('disabled', true);
	    prev.removeAttribute('disabled');
	} else if (currentPage == 1) {
	    prev.setAttribute('disabled', true);
	    next.removeAttribute('disabled');
	} else {
		prev.removeAttribute('disabled');
		next.removeAttribute('disabled');
	}
}

function show_next() {
	currentPage++;
	if (currentPage <= maxPage) {
		setVisiblePage(currentPage);
		// editor.setValue($('#source-' + currentPage).text(), -1);

		setEditorPage(currentPage);
		document.getElementById('swiftOutput').innerHTML = "";
		hideFiles();
		check_buttons();
	}
}

function show_prev() {
	currentPage--;
	if (currentPage > 0) {
		setVisiblePage(currentPage);
		//editor.setValue($('#source-' + currentPage).text(), -1);
		setEditorPage(currentPage);
		document.getElementById('swiftOutput').innerHTML = "";
		hideFiles();
		check_buttons();
	} 
}

function reset_text() {
	setEditorPage(currentPage);
}

function execute_code() {
	var sourceCode = editor.getValue();
	if (!sourceCode) {
		alert("Source text is empty!");
		return false;
	}
	next.setAttribute('disabled', true);
	prev.setAttribute('disabled', true);
	topics.setAttribute('disabled', true);
	document.getElementById('swiftOutput').innerHTML = "";
	hideFiles();

	$.ajax({
		type: 'POST',
		url: 'tryswift.php',
		data:{'source': sourceCode},
	})
	.done(function (data) {
		var urlArray = data.split("\n");
		tailf(urlArray[0], "#swiftOutput");
		$.post("getfiles.php", {dir: urlArray[1]}).done(function(filedata) {
			$('#outputs').append(filedata);
			var x = document.getElementById("outputs");
			$('#outputs').show();
			check_buttons();
			topics.removeAttribute('disabled');
		    });
	    });	
}

function popupwindow(url, name, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, name, 'width='+w+', height='+h+', top='+top+', left='+left);
} 

$(document).ready(function () {
	$.get('scripts/index.txt', function(data) {	
		index = data.split("\n");
		maxPage = index.length;

		// var page = document.createElement('div');
		// page.className = 'example hidden';
		// page.id = 'page-01';
		// document.getElementById('wrapright').appendChild(page);
		// $("div#page-01").html("<iframe src=\"scripts/01-page.html\" style=\"border-style: none; width: 100%; height: 1600px;\"></iframe>");

		for (var i = 1; i <= maxPage; i++) {
			i = numConvert(i);
			var page = document.createElement('div');
			page.className = 'example hidden';
			page.id = 'page-' + i;
			document.getElementById('wrapright').appendChild(page);
			$("div#page-" + i).html(function() {
				var pageLoc = "scripts/" + i + "-page.html";
				return "<iframe src=\"" + pageLoc + "\" style=\"border-style: none; width: 100%; height: 1600px;\"></iframe>";
			});

			var source = document.createElement('div');
			source.id = 'source-' + i;
			source.className = 'sourceToHide';
			document.getElementById('wrapright').appendChild(source);
			$.get("scripts/" + i + "-source.txt", function(data) {
				//$("div#source-" + i).html(data);
				//alert(data);
				$("div#source-" + i).html(data);
				alert($('#source-' + i).text());
			});
		
			// var source = document.createElement('div');
			// source.id = 'source-' + i;
			// source.className = 'sourceToHide';
			// document.getElementById('wrapright').appendChild(source);
			// $("div#source-" + i).html(function() {
			// 	var sourceLoc = "scripts/" + i + "-source.txt";
			// 	return "<iframe src=\"" + sourceLoc + "\"></iframe>";
			// });


			// var source = document.createElement('div');
			// source.id = 'source-' + i;
			// source.className = 'sourceToHide';
			// document.getElementById('page-'+i).appendChild(source);
			// $.get("scripts/" + i + "-source.txt", function(data) {
			// 	//alert(data);
			// 	$("div#source-" + i).html(data);
			// 	alert($('#source-01').text());
			// });

		}

		var source = document.createElement('div');
		source.id = 'source-01';
		source.className = 'sourceToHide';
		document.getElementById('wrapright').appendChild(source);
		
		//$("#source-01").load("scripts/01-source.txt");
		//alert($('#source-01').text());
		//$("div#source-01").html("<iframe src=\"scripts/01-source.txt\"></iframe>");
		//alert($('#source-01').text());
		
		setVisiblePage(1);
		setEditorPage(1);
		//editor.setValue($('#source-01').text(), -1);
		
		//editor.setValue("hello");
		
		next = document.getElementById('nextButton');
		prev = document.getElementById('previousButton');
		reset = document.getElementById('resetButton');
		execute = document.getElementById('executeButton');
		topics = document.getElementById('topics');

		next.addEventListener('click', show_next);
		prev.addEventListener('click', show_prev);
		reset.addEventListener('click', reset_text);
		execute.addEventListener('click', execute_code);

		$(document).on("change", "#topics", function() {
			var selectedTopic = $('#topics').val();
			var page_num = index.indexOf(selectedTopic) + 1;
			currentPage = page_num;
			setVisiblePage(currentPage);
			setEditorPage(currentPage);
			document.getElementById('swiftOutput').innerHTML = "";
			hideFiles();
			check_buttons();
		});

		$(document).on("change", "#outputs", function(){
			var selected = $('#outputs').val();
			if (selected != "File outputs") {
				popupwindow($('#outputs').val(), '', 800, 600); 
			}
		});
		
		// setVisiblePage(1);
		// editor.setValue($('#source-' + 04).text(), -1);
		
	});
});


