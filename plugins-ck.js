// Avoid `console` errors in browsers that lack a console.
(function(){var e,t=function(){},n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=n.length,i=window.console=window.console||{};while(r--){e=n[r];i[e]||(i[e]=t)}})();(function(e){var t=!1,n=function(t){t.after('<div class="mfs-container"></div>');var n=t.next("div.mfs-container");t.appendTo(n);var r="",i="",o="",u=0;t.find("> option, optgroup").each(function(){var t=e(this).get(0).tagName.toLowerCase();if(t=="option"){var n="",i=e(this).html();if(r==""||e(this).is(":selected")){r=i;e(this).is(":selected")&&(n=" selected")}o+='<li class="mfs-option'+n+'"><a href="#" index="'+u+'">'+i+"</a></li>";u++}if(t=="optgroup"){var s=e(this).attr("label");mfsOptGroupHtml='<li class="mfs-optgroup">'+s+"</li>";e(this).find("option").each(function(){var t="",n=e(this).html();if(r==""||e(this).is(":selected")){r=n;e(this).is(":selected")&&(t=" selected")}mfsOptGroupHtml+='<li class="mfs-option mfs-optgroup-option'+t+'"><a href="#" index="'+u+'">'+n+"</a></li>";u++});o+=mfsOptGroupHtml}});i+='<a class="mfs-selected-option" href="#">'+r+"<span>&nbsp;</span></a>";i+='<ul class="mfs-options">'+o+"</ul>";n.prepend(i);s(n)},r=function(e){var t=e.find("select");t.removeClass("mfs-enabled");e.before(t);e.remove()},i=function(e){var t=e.find("select");e.before(t);e.remove();n(t)},s=function(n){var r=n.find("select"),i=r.find("option"),s=n.find("a.mfs-selected-option"),o=n.find("ul.mfs-options"),u=o.find("li.mfs-option"),a=o.find("a");o.hide();s.click(function(){var n=e("ul.mfs-options");if(o.is(":visible")){o.hide();t=!0}else{u.removeClass("active");n.hide();o.show();var r=o.find("li.mfs-option.selected");r.length>0?r.addClass("active"):o.find("li.mfs-option:first-child").addClass("active");t=o}e(this).blur();return!1});a.click(function(){u.removeClass("active").removeClass("selected");e(this).closest("li").addClass("selected");s.html(e(this).text()+"<span>&nbsp;</span>");i.removeAttr("selected");i.eq(e(this).attr("index")).prop("selected","selected");o.hide();if(r.selectedIndex!=e(this).attr("index")&&r.onchange){r.selectedIndex=e(this).attr("index");r.onchange()}if(r.selectedIndex!=e(this).attr("index")){r.selectedIndex=e(this).attr("index");r.trigger("change")}return!1});u.mouseover(function(){u.removeClass("active");e(this).addClass("active")});r.addClass("mfs-enabled")},o=function(e){var t=e.find("select"),r=t.find("option"),i=e.find("a.mfs-selected-option"),s=e.find("ul.mfs-options"),o=s.find("li"),u=s.find("a");t.on("change.mfsEnableRefresh",function(){e.before(t);e.remove();n(t)})},u={init:function(r){var i=e.extend({refresh:!0,radio:!1,checkbox:!1},r);this.each(function(){var t=e(this),r=t.find("select");r.length>0&&r.each(function(){var t=e(this);t.hasClass("mfs-enabled")||n(t)})});e(window).click(function(){e("ul.mfs-options").hide()});e(document).keydown(function(n){var r=n.keyCode;if(t!==!1&&(r==13||r==38||r==40||r==27)){var i=t.find("li.mfs-option.active");if(r==38){n.preventDefault();var s=i.prevAll(".mfs-option:first");if(s.length>0){s.addClass("active");i.removeClass("active")}}else if(r==40){n.preventDefault();var s=i.nextAll(".mfs-option:first");if(s.length>0){s.addClass("active");i.removeClass("active")}}else r==13?i.find("a").click():r==27&&e("ul.mfs-options").hide()}})},refresh:function(){t=!1;this.each(function(){var t=e(this).find("div.mfs-container");t.length>0&&t.each(function(){var t=e(this);i(t)})})},destroy:function(){t=!1;this.each(function(){var t=e(this).find("div.mfs-container");t.length>0&&t.each(function(){var t=e(this);r(t)})})}};e.fn.mfs=function(t){if(u[t])return u[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return u.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.mfs")}})(jQuery);