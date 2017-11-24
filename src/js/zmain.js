(function( $, window, undefined ) {
  var isPushEnabled = false;

  // Menu
  $("#menu").click(function() {
    $("body").addClass("push-menu-to-right");
    $("#sidebar").addClass("open");
    $(".overlay").addClass("show");
  });

  $("#mask").click(function() {
    $("body").removeClass("push-menu-to-right");
    $("#sidebar").removeClass("open");
    $(".overlay").removeClass("show");
  });

  // Search
  var bs = {
    close: $(".icon-remove-sign"),
    searchform: $(".search-form"),
    canvas: $("body"),
    dothis: $('.dosearch')
  };

  bs.dothis.on('click', function() {
    $('.search-wrapper').toggleClass('active');
    bs.searchform.toggleClass('active');
    bs.searchform.find('input').focus();
    bs.canvas.toggleClass('search-overlay');
    $('.search-field').simpleJekyllSearch();
  });

  function close_search() {
    $('.search-wrapper').toggleClass('active');
    bs.searchform.toggleClass('active');
    bs.canvas.removeClass('search-overlay');
  }

  bs.close.on('click', close_search);

  // Closing menu with ESC
  document.addEventListener('keyup', function(e){
      if(e.keyCode == 27 && $('.search-overlay').length) {
          close_search();
      }
  });

  if (document.getElementsByClassName('home').length >=1 ) {
      new AnimOnScroll( document.getElementById( 'grid' ), {
        minDuration : 0.4,
        maxDuration : 0.7,
        viewportFactor : 0.2
      });
  }

  smoothScroll.init({
      selectorHeader: '.bar-header', // Selector for fixed headers (must be a valid CSS selector)
      speed: 500, // Integer. How fast to complete the scroll in milliseconds
      updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
  });

  function subscribe() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
        isPushEnabled = true;
        pushButton.textContent = 'Disable Push Messages';
        pushButton.disabled = false;

          // return sendSubscriptionToServer(subscription);
      }).catch(function(e) {
        if (Notification.permission === 'denied') {
          // window.Demo.debug.log('Permission for Notifications was denied');
          pushButton.disabled = true;
        } else {
          // window.Demo.debug.log('Unable to subscribe to push.', e);
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
        }
      });
    });
  }

  function initialiseState() {
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // 测试
      var title = "hello";
      var options = {
        "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
        "icon": "assets/img/ccard.png",
        "vibrate": [200, 100, 200, 100, 200, 100, 400],
        "tag": "request",
        "actions": [
          { "action": "yes", "title": "Yes", "icon": "assets/img/yes.png" },
          { "action": "no", "title": "No", "icon": "assets/img/no.png" }
        ]
      };
      serviceWorkerRegistration.showNotification(title, options);

      // 获取当前订阅状态
      serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
        var pushButton = document.querySelector('.js-push-button');
        pushButton.disabled = false;
        if (!subscription) {
          return;
        }
      });
    });
  }

  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(initialiseState);
  };
})( Zepto, window );
