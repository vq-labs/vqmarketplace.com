const app = angular.module("GetStartedApp", ['ngSanitize', 'ui.select']).config(($locationProvider) => {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

const COUNTRIES = [
  {id: 'AD', text: 'Andorra'},
  {id: 'AT', text: 'Austria'},
  {id: 'BE', text: 'Belgium'},
  {id: 'CA', text: 'Canada'},
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
  {id: 'ES', text: 'Spain'},
  {id: 'US', text: 'United States'}
];

const REFERRALS = [
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

const MARKETPLACE_TYPES = [
  {
    id: 'services', text: 'Services'
  },
  {
    id: 'rentals', text: 'Rentals'
  },
  {
    id: 'products', text: 'Products'
  },
  {
    id: 'bitcoinmeetup', text: 'Cryptocurrency OTC Exchange'
  },
  
];

app.controller("GetStartedController", ($scope, $http, $location) => {
  $scope.marketplaceTypes = MARKETPLACE_TYPES;
  $scope.referrals = REFERRALS;
  $scope.countries = COUNTRIES;

  $scope.data = {
    account: {
      email: '',
      referral: '',
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],

    },
    verification: {
      code: '',
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    credentials: {
      firstname: '',
      lastname: '',
      country: '',
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    marketplace: {
      marketplaceName: '',
      marketplaceType: '',
      password: '',
      repeatPassword: '',
      isSubmitted: false,
      isSubmitting: false,
      errors: [],
      messages: [],
    },
    step: 'account',
    tenant: {}
  };

  const onInit = () => {
    if ($location.search().verificationCode) {
      /**
       * Tracking (2/5) - someone submitted an email
       */
      ga('send', {
        hitType: 'event',
        eventCategory: 'Get Started',
        eventAction: 2,
        eventLabel: 'Someone submitted an email (2/5)'
      });

      $http({
        method: "POST",
        url: VQ_TENANT_API_URL + "/trial-registration/step-2",
        data: {
          verificationCode: $location.search().verificationCode
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
      }).then((response) => {
        if (response.data.tenant) {
          $scope.data.tenant = angular.merge({}, $scope.data.tenant, response.data.tenant);
          $scope.data.verification.isSubmitting = false;
          $scope.data.step = 'credentials';
        }
      }).catch((err) => {
        if (err.status === 400) {
          if (err.data.code === "WRONG_DATA") {
            $scope.data.verification.isSubmitting = false;
            $scope.data.verification.errors.push('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
            $scope.data.step = 'verification';
          } else if (err.data.code === "EMAIL_ALREADY_VERIFIED") {
            $scope.data.verification.isSubmitting = false;
            $scope.data.step = 'verification';
            $scope.data.verification.errors.push('Your e-mail has been already verified. Please check the instructions we have sent you via e-mail.');
          }
        }
      });
    }
  }

  $scope.resendVerificationCode = () => {
    $http({
      method: "POST",
      url: VQ_TENANT_API_URL + "/trial-registration/resendVerificationCode",
      apiKey: $scope.data.tenant.apiKey
    })
      .then((response) => {
        if (response.data.tenant && $scope.data.verification.messages.indexOf('Verification code has been resent to your e-mail. Please check the spam folder in case you have not received it yet.') === -1) {
          $scope.data.verification.messages.push('Verification code has been resent to your e-mail. Please check the spam folder in case you have not received it yet.');
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          if (err.data.code === "WRONG_DATA") {
            $scope.data.verification.errors.push('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
          }
          if (err.data.code === "EMAIL_ALREADY_VERIFIED" && err.data.tenantStatus === 3) {
            $scope.data.verification.errors.push('Your e-mail has been already verified. Please check the instructions we have sent you via e-mail.');
          }
        }
      });
  }

  $scope.submitStep = (step) => {
    switch (step) {
      case 'account': {
        $scope.data.account.errors = [];

        if ($scope.data.account.email === '' || $scope.data.account.referral === '') {
          $scope.data.account.errors.push('Please fill in all required (*) fields.');
          return;
        }

        $scope.data.account.errors = [];
        $scope.data.account.isSubmitting = true;
        
        $http({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-1",
          data: {
            email: $scope.data.account.email,
            source: $scope.data.account.referral
          }
        }).then((response) => {
          if (response.data.tenant) {
            $scope.data.account.isSubmitting = false;
            $scope.data.tenant = angular.merge({}, $scope.data.tenant, response.data.tenant);
            $scope.data.step = 'verification';
          }
        }).catch((err) => {
          if (err.status === 400) {
            if (err.data.code === "TENANT_EMAIL_TAKEN") {
              $scope.data.account.isSubmitting = false;
              $scope.data.account.errors.push('The e-mail you provided is already registered.');
            }
          }
        });
        break;
      }
      case 'verification': {
        $scope.data.verification.errors = [];

        if ($scope.data.verification.code === '') {
          $scope.data.verification.errors.push('Please fill in all required (*) fields.');
          return;
        }

        $scope.data.verification.errors = [];
        $scope.data.verification.isSubmitting = true;

        /**
         * Tracking (3/5) - someone verified an email
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 3,
          eventLabel: 'Someone verified the email (3/5)'
        });

        $http({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-2",
          data: {
            verificationCode: $scope.data.verification.code
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
        }).then((response) => {
          if (response.data.tenant) {
            $scope.data.verification.isSubmitting = false;
            $scope.data.tenant = angular.merge({}, $scope.data.tenant, response.data.tenant);
            $scope.data.step = 'credentials';
          }
        }).catch((err) => {
          if (err.status === 400) {
            if (err.data.code === "WRONG_DATA") {
              $scope.data.verification.isSubmitting = false;
              $scope.data.verification.errors.push('The code you provided does not match the code we have sent you via e-mail. Please copy and paste it again or use the link inside your e-mail to proceed with the registration.');
            }
          }
        });
        break;
      }
      case 'credentials': {
        $scope.data.credentials.errors = [];

        if ($scope.data.credentials.firstname === '' || $scope.data.credentials.lastname === '' || $scope.data.credentials.country === '') {
          $scope.data.credentials.errors.push('Please fill in all required (*) fields.');
          return;
        }

        $scope.data.credentials.errors = [];
        $scope.data.credentials.isSubmitting = true;

        /**
         * Tracking (4/5) - someone verified an email
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 4,
          eventLabel: 'Marketplace information has been submitted (4/5)'
        });

        $http({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-3",
          data: {
            apiKey: $scope.data.tenant.apiKey,
            firstName: $scope.data.credentials.firstname,
            lastName: $scope.data.credentials.lastname,
            country: $scope.data.credentials.country
          }
        }).then((response) => {
          if (response.data.tenant) {
            $scope.data.credentials.isSubmitting = false;
            $scope.data.tenant = angular.merge({}, $scope.data.tenant, response.data.tenant);
            $scope.data.step = 'marketplace';
          }
        }).catch((err) => {
          if (err) {
            $scope.data.credentials.isSubmitting = false;
            $scope.data.credentials.errors.push('The network encountered an error, please try again.');
          }
        });
        break;
      }
      case 'marketplace': {
        $scope.data.marketplace.errors = [];
        if ($scope.data.marketplace.marketplaceName === '' || $scope.data.marketplace.marketplaceType === '' || $scope.data.marketplace.password === '' || $scope.data.marketplace.repeatPassword === '') {
          $scope.data.marketplace.errors.push('Please fill in all required (*) fields.');
          return;
        } else if ($scope.data.marketplace.password !== $scope.data.marketplace.repeatPassword) {
          $scope.data.marketplace.errors.push('Please make sure that both of your passwords match.');
        }

        $scope.data.marketplace.errors = [];
        $scope.data.marketplace.isSubmitting = true;

        /**
         * Tracking (5/5) - someone created a marketplace
         */
        ga('send', {
          hitType: 'event',
          eventCategory: 'Get Started',
          eventAction: 5,
          eventLabel: 'Marketplace has been created'
        });

        $http({
          method: "POST",
          url: VQ_TENANT_API_URL + "/trial-registration/step-4",
          data: {
            apiKey: $scope.data.tenant.apiKey,
            marketplaceName: $scope.data.marketplace.marketplaceName.replace(/[^a-zA-Z0-9]+/g, ''),
            marketplaceType: $scope.data.marketplace.marketplaceType,
            password: $scope.data.marketplace.password,
            repeatPassword: $scope.data.marketplace.repeatPassword,
          }
        }).then((response) => {
          if (response.data.status === 1) {
            $scope.data.marketplace.messages.push('Your marketplace is being created. We will notify you when the process is complete.');

            setInterval(() => {
              $http({
                method: "POST",
                url: VQ_TENANT_API_URL + "/trial-registration/getTenantStatus",
                data: {
                  apiKey: $scope.data.tenant.apiKey
                }
              })
                .then((rData) => {
                  let href;

                  if (rData.data.tenant && rData.data.tenant.status === 3) {
                    $scope.data.marketplace.isSubmitting = false;
                    $scope.data.step = 'success';

                    href = 'https://' + rData.data.tenant.tenantId + '.vqmarketplace.com/app/admin/get-started'
                    /**
                      if (VQ_WEB_ENV === 'production' || VQ_WEB_ENV === 'development') {
                        href = 'https://' + data.tenantId + '.vqmarketplace.com/app/admin/get-started'
                      } else {
                        href = 'http://localhost:4000/app/admin/get-started'
                      }
                    */

                    setTimeout(function() {
                      window.location.replace(href);
                    }, 5000);
                  }
                })
                .catch((err) => {
                  if (err.status === 400) {
                    $scope.data.marketplace.isSubmitting = false;
                    $scope.data.marketplace.errors.push('There was a problem creating your marketplace. Please try again.');
                  }
                });
            }, 2000);
          }
        }).catch((err) => {
          if (err.status === 400) {
            $scope.data.marketplace.isSubmitting = false;
            if (err.data.code === "MARKETPLACE_NAME_NOT_ALLOWED") {
              $scope.data.marketplace.errors.push('The marketplace name you provided is not allowed. Please pick another name to proceed with the registration.');
            } else if (err.data.code === "WRONG_API_KEY") {
              $scope.data.marketplace.errors.push('There was a mismatch of data between the client and the server. Please click the link inside the e-mail we have sent you to proceed with the registration.');
            } else if (err.data.code === "EMAIL_NOT_VERIFIED") {
              $scope.data.marketplace.errors.push('You e-mail is not verified. Please click the link inside the e-mail we have sent you to proceed with the registration.');
            } else if (err.data.code === "API_KEY_USED") {
              $scope.data.marketplace.errors.push('Your marketplace has already been created. We have sent you an e-mail with the instructions on how to view your marketplace.');
            }
          }


        });
        break;
      }
    }
  };

  onInit();
});