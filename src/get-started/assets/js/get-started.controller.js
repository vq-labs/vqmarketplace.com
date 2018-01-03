const app = angular.module("GetStartedApp", ['ngSanitize', 'ui.select']);

app.controller("GetStartedController", ($scope) => {
  $scope.marketplaceTypes = [
    {
      id: 'services', text: 'Services'
    },
    {
      id: 'rentals', text: 'Rentals'
    }
  ];
  $scope.referrals = [
    {
      id: 'facebook', text: 'Facebook'
    },
    {
      id: 'google-search', text: 'Google Search'
    },
    {
      id: 'blog', text: 'Blog post'
    },
    {
      id: 'friend-referral', text: 'Friend Referral'
    },
    {
      id: 'conference', text: 'Conference'
    },
    {
      id: 'other', text: 'Other'
    }
  ];
  $scope.countries = [
    {id: 'AD', text: 'Andorra'},
    {id: 'AT', text: 'Austria'},
    {id: 'BE', text: 'Belgium'},
    {id: 'CY', text: 'Cyprus'},
    {id: 'EE', text: 'Estonia'},
    {id: 'FI', text: 'Finland'},
    {id: 'FR', text: 'France'},
    {id: 'DE', text: 'Germany'},
    {id: 'GR', text: 'Greece'},
    {id: 'IE', text: 'Ireland'},
    {id: 'IT', text: 'Italy'},
    {id: 'LV', text: 'Latvia'},
    {id: 'LT', text: 'Lithuania'},
    {id: 'LU', text: 'Luxembourg'},
    {id: 'MT', text: 'Malta'},
    {id: 'MC', text: 'Monaco'},
    {id: 'NL', text: 'Netherlands'},
    {id: 'PT', text: 'Portugal'},
    {id: 'SM', text: 'San Marino'},
    {id: 'SK', text: 'Slovakia'},
    {id: 'SI', text: 'Slovenia'},
    {id: 'ES', text: 'Spain'}
  ];

    //   var url = window.location.href;
    // var url = new URL(url);
    // var verificationCode = url.searchParams.get("verificationCode");
    // var email = url.searchParams.get("email");

  //1: TENANT_EMAIL_TAKEN The e-mail you provided is already registered.
  //2: WRONG_DATA The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.
  //4: MARKETPLACE_NAME_NOT_ALLOWED The marketplace name you provided is not allowed. Please pick another name to proceed with the registration.
  //4: WRONG_API_KEY There was a mismatch of data between the client and the server. Please click the link inside the e-mail we have sent you to proceed with the registration.
  //4: EMAIL_NOT_VERIFIED You e-mail is not verified. Please click the link inside the e-mail we have sent you to proceed with the registration.
  //4: API_KEY_USED Your marketplace has already been created. We have sent you an e-mail with the instructions on how to view your marketplace.

  $scope.data = {
    account: {
      email: {value: '', status: null},
      referral: {value: '', status: null},
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],

    },
    verification: {
      code: {value: '', status: null},
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    credentials: {
      firstname: {value: '', status: null},
      lastname: {value: '', status: null},
      country: {value: '', status: null},
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    marketplace: {
      marketplaceName: {value: '', status: null},
      marketplaceType: {value: '', status: null},
      password: {value: '', status: null},
      repeatPassword: {value: '', status: null},
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    transitioning: false,
    step: 'account'
  };

  $scope.resendVerificationCode = () => {
    // $.post(VQ_TENANT_API_URL + "/trial-registration/resendVerificationCode", {
    //   apiKey: tenant.apiKey
    // })
    //   .done(function (data) {
    //     if (data.tenant) {
    //       next_fs.find('.alert-info > .text').html('Verification code has been resent to your e-mail. Please check the spam folder in case you have not received it yet.');
    //       next_fs.find('.alert-info').removeClass('hidden').fadeIn();
    //     }
    //   })
    //   .fail(function (err) {
    //     next_fs.find('.alert-info').hide();
    //     if (err.responseJSON.code === "WRONG_DATA") {
    //       next_fs.find('.alert-danger > .text').html('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
    //       next_fs.find('.alert-danger').removeClass('hidden').fadeIn();
    //     }
    //     if (err.responseJSON.code === "EMAIL_ALREADY_VERIFIED" && err.responseJSON.tenantStatus === 3) {
    //       next_fs.find('.alert-danger > .text').html('Your e-mail has been already verified. Please check the instructions we have sent you via e-mail.');
    //       next_fs.find('.alert-danger').removeClass('hidden').fadeIn();
    //     } else {
    //       showNext(next_fs.find('button'));
    //     }
    //   });
  }

  $scope.submitStep = (step) => {
    switch (step) {
      case 'account': {
        // if ($scope.data.account.email.value === '' || $scope.data.account.referral.value === '') {
        //   $scope.data.account.errors.account.push('Please fill in all required (*) fields.');
        // }

        //         $.ajax({
        //   method: "POST",
        //   url: VQ_TENANT_API_URL + "/trial-registration/step-1",
        //   data: {
        //     email: parent.find('#email').val(),
        //     source: parent.find('#source').val()
        //   }
        // }).done(function (data) {
        //   if (data.tenant) {
        //     tenant = $.extend({}, tenant, data.tenant);
        //     current_fs.find('.alert-danger').hide();
        //     l.stop();
        //     showNext(elem)
        //   }
        // }).fail(function (err) {
        //   l.stop();
        //   if (err.responseJSON.code === "TENANT_EMAIL_TAKEN") {
        //     current_fs.find('.alert-danger > .text').html('The e-mail you provided is already registered.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   }
        // });

        $scope.data.step = 'verification';
        break;
      }
      case 'verification': {

        // /**
        //  * Tracking (3/5) - someone verified an email
        //  */
        // ga('send', {
        //   hitType: 'event',
        //   eventCategory: 'Get Started',
        //   eventAction: 3,
        //   eventLabel: 'Someone verified the email (3/5)'
        // });
        //
        // $.ajax({
        //   method: "POST",
        //   url: VQ_TENANT_API_URL + "/trial-registration/step-2",
        //   data: {
        //     verificationCode: parent.find('#verificationCode').val()
        //   }
        // }).done(function (data) {
        //   if (data.tenant) {
        //     tenant = $.extend({}, tenant, data.tenant);
        //     current_fs.find('.alert-danger').hide();
        //     l.stop();
        //     showNext(elem)
        //   }
        // }).fail(function (err) {
        //   l.stop();
        //   if (err.responseJSON.code === "WRONG_DATA") {
        //     current_fs.find('.alert-danger > .text').html('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   }
        // });


        $scope.data.step = 'credentials';
        break;
      }
      case 'credentials': {

        // /**
        //  * Tracking (4/5) - someone verified an email
        //  */
        // ga('send', {
        //   hitType: 'event',
        //   eventCategory: 'Get Started',
        //   eventAction: 4,
        //   eventLabel: 'Marketplace information has been submitted (4/5)'
        // });
        //
        // $.ajax({
        //   method: "POST",
        //   url: VQ_TENANT_API_URL + "/trial-registration/step-3",
        //   data: {
        //     apiKey: tenant.apiKey,
        //     firstName: parent.find('#firstname').val(),
        //     lastName: parent.find('#lastname').val(),
        //     country: parent.find('#country-select').val()
        //   }
        // }).done(function (data) {
        //   if (data.tenant) {
        //     tenant = $.extend({}, tenant, data.tenant);
        //     current_fs.find('.alert-danger').hide();
        //     l.stop();
        //     showNext(elem)
        //   }
        // }).fail(function () {
        //   l.stop();
        // });

        $scope.data.step = 'marketplace';
        break;
      }
      case 'marketplace': {


        // /**
        //  * Tracking (5/5) - someone created a marketplace
        //  */
        // ga('send', {
        //   hitType: 'event',
        //   eventCategory: 'Get Started',
        //   eventAction: 5,
        //   eventLabel: 'Marketplace has been created'
        // });
        //
        // l.start();
        // $.ajax({
        //   method: "POST",
        //   url: VQ_TENANT_API_URL + "/trial-registration/step-4",
        //   data: {
        //     apiKey: tenant.apiKey,
        //     marketplaceName: parent.find('#marketplaceName').val(),
        //     marketplaceType: parent.find('#marketplaceType').val(),
        //     password: parent.find('#password').val(),
        //     repeatPassword: parent.find('#repeatPassword').val(),
        //   }
        // }).done(function (data) {
        //   if (data.status === 1) {
        //     current_fs.find('.alert.alert-danger').hide();
        //     current_fs.find('.alert.alert-info > .text').html('Your marketplace is being created. We will notify you when the process is complete.');
        //     current_fs.find('.alert.alert-info').removeClass('hidden').fadeIn();
        //
        //     setInterval(function () {
        //       $.post(VQ_TENANT_API_URL + "/trial-registration/getTenantStatus", {
        //         apiKey: data.apiKey
        //       })
        //         .done(function (rData) {
        //           if (rData.tenant) {
        //             if (rData.tenant.status === 3) {
        //               l.stop();
        //               showNext(elem)
        //               setTimeout(function () {
        //                 var href;
        //
        //                 if (VQ_WEB_ENV === 'production') {
        //                   href = 'https://' + data.tenantId + '.vq-labs.com/app/admin/get-started'
        //                 } else if (VQ_WEB_ENV === 'development') {
        //                   href = 'https://' + data.tenantId + '.vqmarketplace.com/app/admin/get-started'
        //                 } else {
        //                   href = 'http://localhost:4000/app/admin/get-started'
        //                 }
        //
        //                 window.location = href;
        //
        //               }, 5000)
        //             }
        //           }
        //         })
        //         .fail(function (err) {
        //           l.stop();
        //         });
        //     }, 2000);
        //   }
        // }).fail(function (err) {
        //   l.stop();
        //   if (err.responseJSON.code === "MARKETPLACE_NAME_NOT_ALLOWED") {
        //     current_fs.find('.alert-danger > .text').html('The marketplace name you provided is not allowed. Please pick another name to proceed with the registration.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   } else if (err.responseJSON.code === "WRONG_API_KEY") {
        //     current_fs.find('.alert-danger > .text').html('There was a mismatch of data between the client and the server. Please click the link inside the e-mail we have sent you to proceed with the registration.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   } else if (err.responseJSON.code === "EMAIL_NOT_VERIFIED") {
        //     current_fs.find('.alert-danger > .text').html('You e-mail is not verified. Please click the link inside the e-mail we have sent you to proceed with the registration.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   } else if (err.responseJSON.code === "API_KEY_USED") {
        //     current_fs.find('.alert-danger > .text').html('Your marketplace has already been created. We have sent you an e-mail with the instructions on how to view your marketplace.');
        //     current_fs.find('.alert-danger').removeClass('hidden').fadeIn();
        //   }
        // });

        $scope.data.step = 'success';
        break;
      }
    }
  };
});