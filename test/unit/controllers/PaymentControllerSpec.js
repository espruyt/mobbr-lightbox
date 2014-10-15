describe('mobbr-lightbox.controllers: PaymentController', function () {
    'use strict';

    // loading ngmock
    beforeEach(module('ngMockE2E'));
    // load the controller's module
    beforeEach(module('mobbr-lightbox.controllers'));

    var contr,
        scope,
        rootScope,
        httpBackend,
        routeParams,
        session;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, mobbrSession) {
        contr = $controller;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        session = mobbrSession;

        httpBackend = $httpBackend;
        routeParams = {hash: 'aHR0cDovL2dpdGh1Yi5jb20vbW9iYnJ0ZXN0'};

    }));

    function createController() {

        contr('PaymentController', {
            $scope: scope,
            $rootScope: rootScope,
            $routeParams: routeParams
        });

    }

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    function createWithTask() {
        createController();
        httpBackend.expectGET('https://test-api.mobbr.com/api_v1/uris/info?url=http:%2F%2Fgithub.com%2Fmobbrtest').respond(200, {"result": {"script": {"description": "mobbrtest has 1 repository available. Follow their code on GitHub.", "image": "https:\/\/images.weserv.nl?url=ssl:avatars1.githubusercontent.com%2Fu%2F8267494%3Fv%3D2%26s%3D400&h=150&w=150&t=square&trim=20", "title": "Github user 'mobbrtest'", "url": "http:\/\/github.com\/mobbrtest", "type": "donate", "language": "EN", "participants": [
            {"id": "mailto:octocat@github.com", "role": "Platform-owner", "share": "10%"},
            {"id": "https:\/\/github.com\/mobbrtest", "role": "", "share": 1}
        ], "message": "Donations will be sent directly to this user.", ".script-type": ["api"]}, "statistics": {"lastpaiddatetime": "2014-08-27 13:33:37", "firstpaiddatetime": "2014-08-22 17:09:45", "num_recipients": "4", "num_senders": "1", "num_payments": "47", "num_currencies": "1", "currencies": ["EUR"], "recipient_num_nationalities": "1", "nationalities": ["NL"], "recipient_age_average": "33.0000", "recipient_age_standard_deviation": "0.0000", "recipient_share_average": "63.829787234043", "recipient_share_standard_deviation": "40.714532482565", "recipient_amount_average": "5.042553191489362", "recipient_amount_standard_deviation": "5.95303408001407", "sender_amount_average": "6.595744680851064", "sender_amount_standard_deviation": "5.984588627566236", "amount_currency": "EUR", "amount_total": "310", "amount_average": "6.595744680851064", "amount_standard_deviation": "5.984588627566236", "is_pledge": "1", "has_unclaimed_shares": "1", "num_partipants": "2"}}, "message": null});
        httpBackend.flush();
    }

    it('should create the controller on a page with a hash and load the task', function () {
        createWithTask();
        expect(scope.task).not.toBe(undefined);
        expect(scope.url).toBe('http://github.com/mobbrtest');
    });

    it('should correct the url from the response', function () {
        routeParams.hash = 'aHR0cDovL2dpdGh1Yi5jb20vbW9iYnJ0ZXN0L2lzc3Vlcw==';

        createController();
        httpBackend.expectGET('https://test-api.mobbr.com/api_v1/uris/info?url=http:%2F%2Fgithub.com%2Fmobbrtest%2Fissues').respond(200, {"result": {"script": {"description": "mobbrtest has 1 repository available. Follow their code on GitHub.", "image": "https:\/\/images.weserv.nl?url=ssl:avatars1.githubusercontent.com%2Fu%2F8267494%3Fv%3D2%26s%3D400&h=150&w=150&t=square&trim=20", "title": "Github user 'mobbrtest'", "url": "http:\/\/github.com\/mobbrtest", "type": "donate", "language": "EN", "participants": [
            {"id": "mailto:octocat@github.com", "role": "Platform-owner", "share": "10%"},
            {"id": "https:\/\/github.com\/mobbrtest", "role": "", "share": 1}
        ], "message": "Donations will be sent directly to this user.", ".script-type": ["api"]}, "statistics": {"lastpaiddatetime": "2014-08-27 13:33:37", "firstpaiddatetime": "2014-08-22 17:09:45", "num_recipients": "4", "num_senders": "1", "num_payments": "47", "num_currencies": "1", "currencies": ["EUR"], "recipient_num_nationalities": "1", "nationalities": ["NL"], "recipient_age_average": "33.0000", "recipient_age_standard_deviation": "0.0000", "recipient_share_average": "63.829787234043", "recipient_share_standard_deviation": "40.714532482565", "recipient_amount_average": "5.042553191489362", "recipient_amount_standard_deviation": "5.95303408001407", "sender_amount_average": "6.595744680851064", "sender_amount_standard_deviation": "5.984588627566236", "amount_currency": "EUR", "amount_total": "310", "amount_average": "6.595744680851064", "amount_standard_deviation": "5.984588627566236", "is_pledge": "1", "has_unclaimed_shares": "1", "num_partipants": "2"}}, "message": null});
        httpBackend.flush();

        expect(scope.url).toBe('http://github.com/mobbrtest');

    });

    function expectPreview() {
        httpBackend.expectPOST('https://test-api.mobbr.com/api_v1/payments/preview').respond(200, {"result": {"hash": "84e365d3ffefb2cc7d6e17cb933a3623", "script": {"description": "mobbrtest has 1 repository available. Follow their code on GitHub.", "image": "https:\/\/avatars1.githubusercontent.com\/u\/8267494?v=2&s=400", "title": "Github user 'mobbrtest'", "url": "http:\/\/github.com\/mobbrtest", "type": "donate", "language": "EN", "participants": [
            {"id": "mailto:octocat@github.com", "role": "Platform-owner", "share": "10%", ".x-id": "3bf31c8b02ba6af7fcadd57f04c185fb", ".amount": "0.1", ".percentage": "10", ".gravatar": "d41d8cd98f00b204e9800998ecf8427e"},
            {"id": "https:\/\/github.com\/mobbrtest", "role": "", "share": 1, ".x-id": "8e4d2453644f7d71c2a6a89a456dae49", ".amount": "0.9", ".percentage": "90", ".gravatar": "d41d8cd98f00b204e9800998ecf8427e"}
        ], "message": "Donations will be sent directly to this user.", ".script-type": ["api"], ".amount": "1", ".currency": "EUR", ".invoiced": false, ".referrer": null, ".bitcoin_address": 0, ".favicon": "https:\/\/www.google.com\/s2\/favicons?domain=github.com", ".logo": "http:\/\/github.com\/apple-touch-icon.png"}, "url": "http:\/\/github.com\/mobbrtest"}, "message": null});
    }

    it('should preview the payment even when the user is not loggedin', function () {
        createWithTask();

        scope.form.amount = '1';
        scope.currency = 'EUR';
        expect(session.isAuthorized()).toBe(false);

        scope.preview(true);
        expectPreview();
        expect(scope.showPreview).toBe(false);
        expect(scope.previewLoading).not.toBe(undefined);
        expect(scope.previewLoading.$resolved).toBe(false);

        httpBackend.flush();
        expect(scope.previewLoading.$resolved).toBe(true);
        expect(scope.showPreview).toBe(true);
        expect(scope.previewScript).not.toBe(undefined);
        expect(scope.previewScript.participants.length).toBe(2);
    });

    it('should not preview when there is no amount entered', function () {
        createWithTask();

        scope.currency = 'EUR';
        expect(session.isAuthorized()).toBe(false);

        scope.preview(true);
        expect(scope.previewLoading).toBe(undefined);
    });

    function expectLogin() {
        httpBackend.expectPUT('https://test-api.mobbr.com/api_v1/user/password_login').respond(200, {"result": {"username": "Patrick", "email": "patrick@mobbr.com", "status": "activated", "kyc_level": "none", "currency_iso": "EUR", "registerdatetime": "2014-07-31 23:05:59", "lastlogindatetime": "2014-08-27 13:33:00", "kyclightdatetime": null, "kycregulardatetime": null, "firstname": "Patrick", "lastname": null, "birthday": null, "address": null, "country_of_residence": "", "occupation": null, "income_range": null, "nationality": null, "language_iso": "EN", "timezone": null, "bitcoin_address": null, "ripple_address": null, "iban_address": null, "companyname": null, "vat_number": null, "vat_rate": "0", "invoice_numbering_prefix": null, "invoice_numbering_postfix": null, "mangopay_identity_proof": "PROOF_REQUIRED", "mangopay_address_proof": "PROOF_REQUIRED", "updatesdatetime": null, "id": ["https:\/\/api.mobbr.com\/id\/Patrick", "mailto:patrick@mobbr.com"], "thumbnail": "https:\/\/secure.gravatar.com\/avatar\/e6032c3bbb3ece98d2782862594b08c2?size=30&d=https:\/\/mobbr.com\/img\/default-gravatar.png", "token": "3d7a7a8468d71fe4ee6875781ec00c48", "setting": {"hide_my_outgoing_payments": "0", "hide_my_incoming_payments": "0", "hide_my_items": "0", "hide_my_email_from_public": "1", "hide_my_email_from_donators": "0", "send_monthly_reports": "1", "send_newsletter": "1", "send_json_mention_notification": "1", "send_payment_received_notification": "1", "send_payment_expired_notification": "1"}, "msg": ["Your identity is empty. Your account has currency and payment restrictions until you supply your identity.", "Your VAT number is empty. You can do work as a non-taxable person (not classified as an entrepeneur) and your invoices on your behalf will be generated without VAT. Consult the taxations laws of your country.", "Your VAT number is empty. You can crowdsource tasks but VAT will be reversed charged to the crowdworkers, possibly lowering their reward."]}, "message": {"text": "Welcome back, previous login: 2014-08-27 13:33:00", "type": "info"}});
    }

    function expectPing(){
        httpBackend.expectGET('https://test-api.mobbr.com/api_v1/user/ping').respond(200, {});
    }

    it('should login', function () {
        createWithTask();

        scope.loginform.username = 'test';
        scope.loginform.password = 'test';

        scope.login();
        expectLogin();
        expectPing();
        expect(scope.authenticating).not.toBe(undefined);
        expect(scope.authenticating.$resolved).toBe(false);

        httpBackend.flush();
        expect(scope.authenticating.$resolved).toBe(true);
        expect(session.isAuthorized()).toBe(true);
    });

    function expectConfirm() {
        httpBackend.expectPUT('https://test-api.mobbr.com/api_v1/payments/confirm').respond(200,{result:{payment_id:'123'}});
    }

    it('should login then preview and the confirm', function () {
        createWithTask();

        scope.loginform.username = 'test';
        scope.loginform.password = 'test';

        scope.currency = 'EUR';
        scope.form.amount = '1';

        scope.formHolder.pledgeForm = {$valid: true};

        scope.performPayment();
        expectLogin();
        expectPreview();
        expectPing();
        expectConfirm();

        httpBackend.flush();
        expect(scope.paymentId).toBe('123');
    });

    it('should just preview and perform when already loggedin', function(){
        createWithTask();

        scope.loginform.username = 'test';
        scope.loginform.password = 'test';

        scope.currency = 'EUR';
        scope.form.amount = '1';

        scope.login();
        expectLogin();
        expectPing();
        httpBackend.flush();

        scope.formHolder.pledgeForm = {$valid: true};

        scope.performPayment();

        expectPreview();
        expectConfirm();
        httpBackend.flush();
        expect(scope.paymentId).toBe('123');
    });

    it('should reset performing when performing fails and set the error message', function(){
        createWithTask();

        scope.loginform.username = 'test';
        scope.loginform.password = 'test';

        scope.currency = 'EUR';
        scope.form.amount = '1';

        scope.formHolder.pledgeForm = {$valid: true};

        scope.performPayment();
        expect(scope.performing).toBe(true);
        expectLogin();
        expectPreview();
        expectPing();
        httpBackend.expectPUT('https://test-api.mobbr.com/api_v1/payments/confirm').respond(400,{message:{text:'fout',type:'error'}});
        expect(scope.message).toBe(undefined);

        httpBackend.flush();
        expect(scope.paymentId).toBe(undefined);
        expect(scope.message).not.toBe(undefined);
        expect(scope.message.text).toBe('fout');
        expect(scope.performing).toBe(false);
    });


});