export type TranslationKeys = {
  dir: 'rtl' | 'ltr';
  title: string;
  welcome:string;
  navigation: {
    app: string;
    features: string;
    services: string;
    about: string;
    home: string;
    tryFree: string;
    dashboard: string;
    howItWorks: string;
  };
  whatispayment:any;
  paymentDescription:string;
  hero: {
    title: string;
    subtitle: string;
  };
  services: {
    title: string;
    instantActivation: {
      title: string;
      description: string;
    };
    currencyConversion: {
      title: string;
      description: string;
    };
    support: {
      title: string;
      description: string;
    }
  };
  features: {
    title: string;
    comprehensiveReport: {
      title: string;
      description: string;
      altText: string;
    };
    dataProtection: {
      title: string;
      description: string;
      altText: string;
    };
    userInterface: {
      title: string;
      description: string;
      altText: string;
    };
    paymentSupport: {
      title: string;
      description: string;
      altText: string;
    };
    mainImageAlt: string;
  };
  devPart: {
    title: string;
    description: string[];
    platformLogoAlt: string;
  };
  downloadApp: {
    title: string;
    description: string;
    startNow: string;
  };
  common:{
    createdSuccessfully:string;
    errorOccurred:string;
    updatedSuccessfully:string;
    confirmDelete:string;
    deletedSuccessfully:string;
    addNew:string;
    edit:string;
    delete:string;
    cancel:string;
    save:string;
    create:string;
    update:string;
    close:string;
    loading:string;
    type:string;
    status:string;
    actions:string;
    view:string;
    noData:string;
    active:string;
    inactive:string;
    value:string;
    statusUpdated:string;
    selectType:string;
    confirmDeleteMessage:string;
    noResponse:string;
    unexpectedError:string;
    copiedToClipboard:string;
    notFound:string;
    storePayment:string;
    copyToClipboard:string;
    
  },
  verification: {
    stepTitles: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    stepDescriptions: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    startVerification: string;
    secureVerification: string;
    secureVerificationDesc: string;
    frontSide: string;
    backSide: string;
    fileNote: string;
    frontUploaded: string;
    backUploaded: string;
    uploadSuccessful: string;
    bothSidesRequired: string;
    pleaseUploadBoth: string;
    liveSelfie: string;
    takePhoto: string;
    retakePhoto: string;
    verificationComplete: string;
    verificationSuccess: string;
    confirmationMessage: string;
    finalMessage: string;
    back: string;
    continue: string;
    submit: string;
  };
  verifications: {
    details: string;
    rejectionDetails: string;
    reason: string;
    type: string;
    uploadedPhotos: string;
    frontPhoto: string;
    backPhoto: string;
    selfiePhoto: string;
    approve: string;
    reject: string;
  }
  footer: {
    platformDesc: string;
    innovativeSolutions: string;
    emailPlaceholder: string;
    send: string;
    company: {
      title: string;
      support: string;
      successStories: string;
      privacySettings: string;
    };
    quickLinks: {
      title: string;
      premiumSupport: string;
      services: string;
      downloadApp: string;
    };
    followUs: {
      title: string;
    };
  };
  auth: {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    name: string;
    userName: string;
    mobile: string;
    forgotPassword: string;
    confirmPassword:string;
    clickHere: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    submitting: string;
    customerName: string;
    enterFullName: string;
    validation: {
        invalidEmail: string;
        emailRequired:  string;
        passwordLength: string;
        passwordRequired:  string;
        nameRequired:  string;
        nameMinLength:  string;
        nameInvalid:  string;
        mobileInvalid:  string;
        mobileRequired:  string;
      },
      toast: {
        registerSuccess:  string;
        loginSuccess:  string;
        unexpectedError:  string;
      },
      forgetPassword: {
        title: string;
        subTitle: string;
        email: string;
        sendOtp: string;
        sending: string;
        otpTitle: string;
        otpSubTitle: string;
        otpPlaceholder: string;
        verifyOtp: string;
        verifying: string;
        resetTitle: string;
        resetSubTitle: string;
        newPassword: string;
        confirmPassword: string;
        resetPassword: string;
        resetting: string;
        validation: {
          otpRequired: string;
          otpLength: string;
          passwordMinLength: string;
          passwordRequired: string;
          confirmPasswordMatch: string;
          confirmPasswordRequired: string;
          otpInvalid: string;
        },
        toast: {
        otpSent: string;
        otpError: string;
        otpVerified: string;
        resetSuccess: string;
        resetError: string;
      }
      }
  };
  sidebar: {
    manage: string;
    preferences: string;
    dashboard: string;
    transactions: string;
    invoices: string;
    verifications: string;
    Rejectedreasons: string;
    identityVerification: string;
    checkout: string;
    stores: string;
    employees: string;
    vendors: string;
    users: string;
    subscriptions: string;
    paymentsVerifications: string;
    whatsapp: string;
    price: string;
    advancedSettings: string;
    settings: string;
    documentation: string;
    logout: string;
    downloadApp: string;
    logs: string;
  };
  dashboard: {
    welcome: string;
    greeting: string;
    cards: {
      totalAmount: string;
      pendingAmount: string;
      total_platform_fees_amount: string;
      totalTransactions: string;
      activeStores: string;
      inactiveStores: string;
      totalUsers: string;
      totalVendors: string;
      totalCashback: string;
      currency: string;
      time: string;
      store: string;
      devMode: {
        switch: string;
        mode: string;
        view: string;
      }
    }
  };
  header: {
    notifications: string;
    noNotifications: string;
    profile: string;
    settings: string;
    logout: string;
    updateProfile : string;
    devMode: {
      switchTo: string;
      backTo: string;
    };
    appStatus: {
      title: string;
      active: string;
      inactive: string;
      enable: string;
      disable: string;
      activeDesc: string;
      inactiveDesc: string;
    };
    whatsappStatus: {
      title: string;
      connected: string;
      disconnected: string;
      connectedDesc: string;
      disconnectedDesc: string;
    };
  };
  transactions: {
    analysis: {
      title: string;
      stats: {
        title: string;
        totalTransactions: string;
        totalAmount: string;
        totalFees: string;
      };
      dateRange: {
        title: string;
        from: string;
        to: string;
      };
    };
    lastTransactions: string;
    noTransactions: string;
    currency: string;
    search: {
      placeholder: string;
    };
    table: {
      id: string;
      store: string;
      from: string;
      provider: string;
      amount: string;
      state: string;
      userName: string;
      date: string;
      action: string;
    };
    title: string;
    confirmModal: {
      title: string;
      message: string;
      confirm: string;
      cancel: string;
    };
    status: {
      pending: string;
      completed: string;
    };
    action: {
      markAsCompleted: string;
      completed: string;
    };
    noData: string;
  };
  users: {
    title: string;
    total: string;
    user: string;
    admin: string;
    search: {
      placeholder: string;
    };
    table: {
      id: string;
      image: string;
      name: string;
      email: string;
      mobile: string;
      status: string;
      createdAt: string;
      actions: string;
      view: string;
    };
    actions: {
      activate: string;
      deactivate: string;
    };
    noData: string;
    status: {
      active: string;
      inactive: string;
    };
  };
  vendors: {
    title: string;
    total: string;
    addNew: string;
    modal: {
      title: string;
      cancel: string;
      add: string;
      adding: string;
    };
    validation: {
      email: string;
      password: string;
      name: string;
      mobile: string;
    };
    table: {
      id: string;
      image: string;
      name: string;
      email: string;
      mobile: string;
      status: string;
      createdAt: string;
      actions: string;
    };
    actions: {
      activate: string;
      deactivate: string;
    };
    noData: string;
  };
  paymentVerification: {
    title: string;
    noData: string;
    instructions: string;
    successMessage:string;
    search: {
      placeholder: string;
    };
    submitPayment: string;
    table: {
      id: string;
      userName: string;
      paymentValue: string;
      paymentOption: string;
      date: string;
      state: string;
      actions: string;
    };
    modal: {
      checkTransaction: string;
      close: string;
      application: string;
      required: string;
      selectApplication: string;
      noApplications: string;
      paymentOption: string;
      selectPaymentOption: string;
      checkButton: string;
      selectPaymentMethodFirst: string;
      fillPaymentInfo: string;

      transactionDetails: {
        selectedPaymentId: string;
        title: string;
        value: string;
        transactionId: string;
        senderName: string;
        totalAmount: string;
        transactionDate: string;
        currentStatus: string;
        verificationStatus: string;
        approved: string;
        rejected: string;
        updateStatus: string;
        instapayIdRequired: string;
        instapayIdTooShort: string;
        amountRequired: string;
        invalidAmount: string;
        pleaseSelectPaymentValue: string;
      };
        selectedPaymentId: string;
        selectedPaymentOption: string;
        paymentId: string;
        referenceId: string;
        createdDate: string;
        mobile: string;
        status: string;
        pending: string;
        paymentDetails: string;

    };
    status: {
      verified: string;
      pending: string;
    };
    action: {
      check: string;
    };
  };
  paymentConfirmation: {
    title: string;
    subscriptionDetails: string;
    planName: string;
    description: string;
    loadingPaymentMethods: string;
    noPaymentOptions: string;
    contactSupportSubscription: string;
    contactStoreOwner: string;
    noCheckoutData: string;
    unableToLoadSubscription: string;
    checkRefId: string;
    instapayId: string;
    checkoutDataNotLoaded: string;
    selectPaymentMethod: string;
    transactionCheckedSuccessfully: string;
    failedToCheckTransaction: string;
    notProvided: string;
    notAvailable: string;
    subscriptionType: string;
    maxApplications: string;
    maxEmployees: string;
    maxVendors: string;
    amountPlaceholder: string;
    amount: string;
    currency: string;
    subscriptionPayment: string;
    defaultPaymentOption: string;
    forSubscriptions: string;
    paymentNumbers: {
      ourNumber: string;
      selectMethodFirst: string;
      vcash: string;
      ecash: string;
      wecash: string;
      instapay: string;
      ocash: string;
    };
  };
  subscription: {
    title: string;
    noData: string;
    table: {
      title: string;
      amount: string;
      type: string;
      status: string;
      applications: string;
      employees: string;
      vendors: string;
      createdAt: string;
      updatedAt: string;
      actions: string;
      view: string;
    };
    modal: {
      title: string;
      close: string;
      subscriptionAmount: string;
      subscriptionAmountLabel: string;
      rejectedreasontype: string;
      rejectedreasonValue: string;
      status: string;
      paymentDate: string;
      userInfo: string;
      counts: {
        applications: string;
        vendors: string;
        employees: string;
      };
      subscriptionType: string;
    };
  };
  storeUpdate: {
    title: string;
    logoUpload: {
      acceptedFormats: string;
      updateLogo: string;
      uploading: string;
      toast: {
        selectLogo: string;
        noFile: string;
        success: string;
        error: string;
      };
    };
    form: {
      storeName: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      mobileWallet: {
        label: string;
        placeholder: string;
      };
      website: {
        label: string;
        placeholder: string;
      };
      subdomain: {
        label: string;
        placeholder: string;
      };
      webhook: {
        label: string;
        placeholder: string;
      };
      buttons: {
        saveSettings: string;
        saving: string;
        updateSubdomain: string;
        updating: string;
        update: string;
        check: string;
        checking: string;
      };
    };
    validation: {
      nameRequired: string;
      nameMinLength: string;
      emailRequired: string;
      invalidEmail: string;
      mobileRequired: string;
      invalidPhone: string;
      subdomainRequired: string;
      invalidSubdomain: string;
      webhookRequired: string;
      invalidWebhook: string;
      updateWebhookFirst: string;
    };
    toast: {
      subdomainUpdated: string;
      subdomainError: string;
      settingsUpdated: string;
      settingsError: string;
      webhookValid: string;
      webhookCheckFailed: string;
      webhookUpdated: string;
      webhookUpdateError: string;
      unknownError: string;
    };
  };
  storeDetails: {
    loading: string;
    error: string;
    title: string;
    whatsappMessage: string;
    shareViaWhatsApp: string;
    paymentLinkCopied: string;
    publicPaymentLink: string;
    sharePaymentLink: string;
    copyPaymentLink: string;
    payments: {
      title: string;
      noData: string;
      payment: {
        status: {
          published: string;
          notPublished: string;
        };
      };
    };
    employees: {
      title: string;
      addNew: string;
      form: {
        name: string;
        email: string;
        mobile: string;
        password: string;
        buttons: {
          cancel: string;
          add: string;
          adding: string;
        };
      };
      toast: {
        success: string;
        error: string;
      };
    };
    table: {
      id: string;
      from: string;
      provider: string;
      amount: string;
      state: string;
      userName: string;
      date: string;
      status: {
        pending: string;
        completed: string;
      };
    };
  };
  storepayment: {
    title: string;
    addPayment: string;
    noData: string;
    table: {
      id: string;
      value: string;
      public: string;
      paymentOption: string;
      createdAt: string;
      updatedAt: string;
      actions: string;
      update: string;
    };
    modal: {
      update: {
        title: string;
        choosePayment: string;
        value: string;
        refId: string;
        publicLabel: string;
        yes: string;
        no: string;
        cancel: string;
        save: string;
        saving: string;
      };
      add: {
        title: string;
        paymentOption: string;
        value: string;
        valuePlaceholder: string;
        referenceLabel: string;
        refId: string;
        referencePlaceholder: string;
        visibility: string;
        public: string;
        private: string;
        cancel: string;
        add: string;
        adding: string;
      };
    };
    toast: {
      addSuccess: string;
      updateSuccess: string;
    };
    validation: {
      valueRequired: string;
      refIdRequired: string;
      paymentOptionRequired: string;
    };
  };
  stores: {
    title: string;
    addStore: string;
    table: {
      id: string;
      image: string;
      name: string;
      email: string;
      website: string;
      mobile: string;
      webhook: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      actions: string;
    };
    status: {
      active: string;
      inactive: string;
    };
    noData: string;
    actions: {
      title: string;
      update: string;
      payment: string;
      logs: string;
      details: string;
      manualCheck: string;
      whatsappConnect: string;
    };
  };
  plans: {
    title: string;
    perMonth: string;
    getStarted: string;
    processing: string;
    applications: string;
    Employees: string;
    Vendors: string;
  };
  transactionModal: {
    application: {
      label: string;
      required: string;
      select: string;
      noApplications: string;
    };
    paymentOption: {
      label: string;
      required: string;
      select: string;
    };
    form: {
      check: string;
      checkButton: string;
      close: string;
    };
    details: {
      title: string;
      id: string;
      name: string;
      amount: string;
      date: string;
      status: string;
      verificationStatus: string;
      approved: string;
      rejected: string;
      updateStatus: string;
    };
  };
  price: {
    active: string;
    pending: string;
    inactive: string;
    manageTitle: string;
    addNewPlan: string;
    loading: string;
    yourSubscription: string;
    subscriptionCosts: string;
    perMonth: string;
    paymentWarning: string;
    suspensionWarning: string;
    paymentSuccessMessage: string;
    payNow: string;
    yourPlan: string;
    applications: string;
    employees: string;
    vendors: string;
    change: string;
    validation?: {
      titleRequired: string;
      titleMinLength: string;
      subtitleRequired: string;
      amountRequired: string;
      amountMin: string;
      applicationsRequired: string;
      applicationsMin: string;
      employeesRequired: string;
      employeesMin: string;
      vendorsRequired: string;
      vendorsMin: string;
    };
    modal: {
      addTitle: string;
      editTitle: string;
      title: string;
      titlePlaceholder: string;
      subtitle: string;
      subtitlePlaceholder: string;
      amount: string;
      amountPlaceholder: string;
      applicationsCount: string;
      employeesCount: string;
      vendorsCount: string;
      createPlan: string;
      saveChanges: string;
      deleteTitle: string;
      deleteConfirm: string;
      cancel: string;
      delete: string;
    };
    table: {
      id: string;
      title: string;
      subtitle: string;
      amount: string;
      applications: string;
      employees: string;
      vendors: string;
      action: string;
      noPlans: string;
    };
  };
  logs: {
    clearLogs: string;
    clearSuccess: string;
    noDataToClear: string;
    vendorName: string;
    noLogs: string;
  };
  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };
  table: {
    id: string;
  };
  invoice: {
    title: string;
    billTo: string;
    number: string;
    date: string;
    period: string;
    days: string;
    amountWithoutFees: string;
    lateFees: string;
    developerFees: string;
    totalFees: string;
    subscriptionAmount: string;
    amountInclFees: string;
    total: string;
    deletionDateNote: string;
    specifyingNumber: string;
    thankYou: string;
    errorLoading: string;
    invalidFormat: string;
    unexpectedFormat: string;
    totalAmount: string;
    paidAt: string;
    preview: string;
    noInvoices: string;
    of: string;
  };
  checkout: {
    details: {
      storeInfo: string;
      personalInfo: string;
      labels: {
        name: string;
        email: string;
        mobile: string;
      };
      status: {
        paid: string;
        notPaid: string;
      };
      paymentDetails: {
        id: string;
        refId: string;
        itemId: string;
        paidAt: string;
        createdAt: string;
        updatedAt: string;
        amount: string;
      };
      invoice: {
        paid: string;
        specifyNumber: string;
        thankYou: string;
        notPaid: string;
        payNow: string;
      };
      contact: string;
    };
  };
  settings: {
    enabled: string;
    disabled: string;
    tokenCopied: string;
    profileUpdated: string;
    passwordChanged: string;
    appToken: string;
    Token:string;
  };
  errors: {
    developerMode: string;
    statusUpdated: string;
  };
  employees: {
    title: string;
    total: string;
    addNew: string;
    noData: string;
    form: {
      name: string;
      email: string;
      mobile: string;
      password: string;
      
      buttons: {
        cancel: string;
        add: string;
        adding: string;
        update: string;
        updating: string;
      };
    };
    errors: {
      noUserSelected: string;
      updateFailed: string;
    };
    toast: {
      statusUpdated: string;
    };
    table: {
      id: string;
      name: string;
      email: string;
      mobile: string;
      createdAt: string;
      actions: string;
    };
  };
  userInfo: {
    status: {
      active: string;
      inactive: string;
    };
    connection: {
      enabled: string;
      disabled: string;
      enabledDesc: string;
      disabledDesc: string;
    };
    accountInfo: {
      title: string;
      username: string;
      userType: string;
      transactionStatus: string;
    };
    subscriptionInfo: {
      title: string;
      plan: string;
      description: string;
      amount: string;
      type: string;
      status: string;
      monthly: string;
      upgradeNow: string;
      yearly: string;
      choosePlan: string;
      applicationsCount: string;
      employeesCount: string;
      vendorsCount: string;
      subscriptionDate: string;
      renewalDate: string;
      noSubscription: {
        title: string;
        description: string;
      };
    };
    linkedStores: {
      title: string;
    };
    transactions: {
      title: string;
      transactionId: string;
      refId: string;
      amount: string;
      netAmount: string;
      fees: string;
      status: string;
      completed: string;
      paymentMethod: string;
      senderName: string;
      transactionDate: string;
      notAvailable: string;
    };
  };
  applications: {
    title: string;
    noApplications: string;
    website: string;
    paymentOptions: string;
    activePaymentMethods: string;
    public: string;
    status: {
      active: string;
      inactive: string;
    };
  };
  publicPayment: {
    title: string;
    noCommission: string;
    ourNumber: string;
    instructions: string;
    waitInstructions: string;
    amount: string;
    amountPlaceholder: string;
    phoneNumber: string;
    instapayUsername: string;
    phonePlaceholder: string;
    instapayPlaceholder: string;
    confirmPayment: string;
    submitting: string;
    copy: string;
    copied: string;
    footerNote: string;
    storeNotFound: string;
    customerName: string;
    customerNamePlaceholder: string;
    transferSuccess: string;
    transferNotCompleted: string;
  };
  whatsapp: {
    title: string;
    subtitle: string;
    sessions: {
      title: string;
      subtitle: string;
      connected: string;
      connecting: string;
      disconnected: string;
      lastActivity: string;
      sessionId: string;
      never: string;
      newSession: string;
      createFirst: string;
      noSessions: string;
      noSessionsDesc: string;
      connect: string;
      disconnect: string;
      continueSetup: string;
      sendTest: string;
      delete: string;
      deleteConfirm: string;
      sessionNameUpdated: string;
      sessionDeleted: string;
      sessionCreated: string;
      sessionDisconnected: string;
      connectionSuccess: string;
    };
    qrScanner: {
      title: string;
      subtitle: string;
      generating: string;
      expiresIn: string;
      howToScan: string;
      step1: string;
      step2: string;
      step3: string;
      refresh: string;
      refreshing: string;
      cancel: string;
      scanning: string;
      simulateScan: string;
    };
    templates: {
      title: string;
      create: string;
      edit: string;
      name: string;
      content: string;
      variables: string;
      variablesDetected: string;
      variablesNone: string;
      variablesPlaceholder: string;
      send: string;
      save: string;
      cancel: string;
      delete: string;
      deleteConfirm: string;
      created: string;
      updated: string;
      deleted: string;
      fillRequired: string;
      noConnectedSessions: string;
    };
    sendMessage: {
      title: string;
      session: string;
      recipient: string;
      recipientPlaceholder: string;
      preview: string;
      send: string;
      cancel: string;
      selectSession: string;
      enterRecipient: string;
      fillVariables: string;
      sent: string;
    };
    customMessage: {
      title: string;
      session: string;
      recipient: string;
      recipientPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      attachments: string;
      attachmentsDesc: string;
      attachmentsFormat: string;
      characters: string;
      send: string;
      sending: string;
      recentMessages: string;
      noMessages: string;
      status: {
        sent: string;
        pending: string;
      };
      errors: {
        selectSession: string;
        enterRecipient: string;
        enterMessage: string;
        fileSize: string;
      };
      noSessions: string;
      noSessionsDesc: string;
    };
  };
};

