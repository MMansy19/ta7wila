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
      totalTransactions: string;
      activeStores: string;
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
  };
  transactions: {
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
    search: {
      placeholder: string;
    };
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
      transactionDetails: {
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
    };
    status: {
      verified: string;
      pending: string;
    };
    action: {
      check: string;
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
      actions: string;
      view: string;
    };
    modal: {
      title: string;
      close: string;
      subscriptionAmount: string;
      subscriptionAmountLabel: string;
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
    manageTitle: string;
    addNewPlan: string;
    loading: string;
    yourSubscription: string;
    subscriptionCosts: string;
    perMonth: string;
    paymentWarning: string;
    suspensionWarning: string;
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
};

