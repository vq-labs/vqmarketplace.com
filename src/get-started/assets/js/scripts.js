(function () {
  var current_fs, next_fs; //fieldsets
  var left, opacity, scale; //fieldset properties which we will animate
  var animating; //flag to prevent quick multi-click glitches

  var tenant = {}, current_fsId;

  $(document).ready(function () {
    var url = window.location.href;
    var url = new URL(url);
    var verificationCode = url.searchParams.get("verificationCode");
    var email = url.searchParams.get("email");

    if (email) {

    }

    if (verificationCode) {

      $('fieldset').hide();

      showNext('#btnAccountNext', function () {
        /**
         * Tracking (2/5) - someone submitted an email
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 2,
          eventLabel: 'Someone submitted an email (2/5)'
        });

        $.ajax({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-2",
          data: {
            verificationCode: verificationCode
              .replace(/%40/gi, '@')
              .replace(/%3A/gi, ':')
              .replace(/%24/gi, '$')
              .replace(/%2C/gi, ',')
              .replace(/%3B/gi, ';')
              .replace(/%2B/gi, '+')
              .replace(/%3D/gi, ';')
              .replace(/%3F/gi, '?')
              .replace(/%2F/gi, '/')
          }
        }).done(function (data) {
          if (data.tenant) {
            tenant = $.extend({}, tenant, data.tenant);
            //current_fs.find('.alert-danger').hide();
            showNext('#btnVerificationNext');
          }
        }).fail(function (err) {
          if (err.responseJSON.code === "WRONG_DATA") {
            next_fs.find('.alert-danger > .text').html('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
            next_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          }
          if (err.responseJSON.code === "EMAIL_ALREADY_VERIFIED") {
            next_fs.find('.alert-danger > .text').html('Your e-mail has been already verified. Please check the instructions we have sent you via e-mail.');
            next_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          }
        });
      });
    }
  });

  $('#msform .form-control').on('click', function (e) {
    $('#msform .form-group-custom.focused').removeClass('focused');
    $(this).closest('.form-group-custom').addClass('focused')
  });



  $(".next").click(function () {
    var elem = $(this);
    var parent = elem.parent();
    var l = Ladda.create(this);

    current_fs = parent;
    next_fs = parent.next();
    current_fsId = parent.attr('id');
    next_fsId = parent.next().attr('id');
    switch (next_fsId) {
      case "verification":
        if (parent.find('#email').val() === "" || document.getElementById('email').validationMessage !== "") {
          parent.find('#email').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#email').parent().removeClass('incomplete');
        }

        if (parent.find('#source').val() === "" || document.getElementById('source').validationMessage !== "") {
          parent.find('#source').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#source').parent().removeClass('incomplete');
        }

        l.start();
        $.ajax({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-1",
          data: {
            email: parent.find('#email').val(),
            source: parent.find('#source').val()
          }
        }).done(function (data) {
          if (data.tenant) {
            tenant = $.extend({}, tenant, data.tenant);
            current_fs.find('.alert-danger').hide();
            l.stop();
            showNext(elem)
          }
        }).fail(function (err) {
          l.stop();
          if (err.responseJSON.code === "TENANT_EMAIL_TAKEN") {
            current_fs.find('.alert-danger > .text').html('The e-mail you provided is already registered.');
            current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          }
        });

        break;
      case "credentials":
        if (parent.find('#verificationCode').val() === "" || document.getElementById('verificationCode').validationMessage !== "") {
          parent.find('#verificationCode').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#verificationCode').parent().removeClass('incomplete');
        }
        l.start();


        break;
      case "marketplace":
        if (parent.find('#firstname').val() === "") {
          parent.find('#firstname').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#firstname').parent().removeClass('incomplete');
        }
        if (parent.find('#lastname').val() === "") {
          parent.find('#lastname').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#lastname').parent().removeClass('incomplete');
        }
        if (parent.find('#country-select').val() === "") {
          parent.find('#country-select').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#country-select').parent().removeClass('incomplete');
        }
        l.start();

        /**
         * Tracking (4/5) - someone verified an email
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 4,
          eventLabel: 'Marketplace information has been submitted (4/5)'
        });

        $.ajax({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-3",
          data: {
            apiKey: tenant.apiKey,
            firstName: parent.find('#firstname').val(),
            lastName: parent.find('#lastname').val(),
            country: parent.find('#country-select').val()
          }
        }).done(function (data) {
          if (data.tenant) {
            tenant = $.extend({}, tenant, data.tenant);
            current_fs.find('.alert-danger').hide();
            l.stop();
            showNext(elem)
          }
        }).fail(function () {
          l.stop();
        });

        break;
      case "success": //for the last step
        if (parent.find('#marketplaceName').val() === "") {
          parent.find('#marketplaceName').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#marketplaceName').parent().removeClass('incomplete');
        }
        if (parent.find('#marketplace-type-select').val() === "") {
          parent.find('#marketplace-type-select').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#marketplace-type-select').parent().removeClass('incomplete');
        }
        if (parent.find('#password').val() === "") {
          parent.find('#password').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#password').parent().removeClass('incomplete');
        }
        if (parent.find('#repeatPassword').val() === "" || $('#password').val() !== $('#repeatPassword').val()) {
          parent.find('#repeatPassword').parent().addClass('incomplete');
          return false;
        } else {
          parent.find('#repeatPassword').parent().removeClass('incomplete');
        }

        /**
         * Tracking (5/5) - someone created a marketplace
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 5,
          eventLabel: 'Marketplace has been created'
        });

        l.start();
        $.ajax({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-4",
          data: {
            apiKey: tenant.apiKey,
            marketplaceName: parent.find('#marketplaceName').val(),
            marketplaceType: parent.find('#marketplaceType').val(),
            password: parent.find('#password').val(),
            repeatPassword: parent.find('#repeatPassword').val(),
          }
        }).done(function (data) {
          if (data.status === 1) {
            current_fs.find('.alert.alert-danger').hide();
            current_fs.find('.alert.alert-info > .text').html('Your marketplace is being created. We will notify you when the process is complete.');
            current_fs.find('.alert.alert-info').removeClass('hidden').fadeIn();

            setInterval(function () {
              $.post(VQ_TENANT_API_URL + "/trial-registration/getTenantStatus", {
                apiKey: data.apiKey
              })
                .done(function (rData) {
                  if (rData.tenant) {
                    if (rData.tenant.status === 3) {
                      l.stop();
                      showNext(elem)
                      setTimeout(function () {
                        var href;

                        if (VQ_WEB_ENV === 'production') {
                          href = 'https://' + data.tenantId + '.vq-labs.com/app/admin/get-started'
                        } else if (VQ_WEB_ENV === 'development') {
                          href = 'https://' + data.tenantId + '.vqmarketplace.com/app/admin/get-started'
                        } else {
                          href = 'http://localhost:4000/app/admin/get-started'
                        }

                        window.location = href;

                      }, 5000)
                    }
                  }
                })
                .fail(function (err) {
                  l.stop();
                });
            }, 2000);
          }
        }).fail(function (err) {
          l.stop();
          if (err.responseJSON.code === "MARKETPLACE_NAME_NOT_ALLOWED") {
            current_fs.find('.alert-danger > .text').html('The marketplace name you provided is not allowed. Please pick another name to proceed with the registration.');
            current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          } else if (err.responseJSON.code === "WRONG_API_KEY") {
            current_fs.find('.alert-danger > .text').html('There was a mismatch of data between the client and the server. Please click the link inside the e-mail we have sent you to proceed with the registration.');
            current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          } else if (err.responseJSON.code === "EMAIL_NOT_VERIFIED") {
            current_fs.find('.alert-danger > .text').html('You e-mail is not verified. Please click the link inside the e-mail we have sent you to proceed with the registration.');
            current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          } else if (err.responseJSON.code === "API_KEY_USED") {
            current_fs.find('.alert-danger > .text').html('Your marketplace has already been created. We have sent you an e-mail with the instructions on how to view your marketplace.');
            current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
          }
        });

        break;

      default:
        break;
    }
  });

})();
