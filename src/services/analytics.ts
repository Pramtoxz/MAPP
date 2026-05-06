import analytics from '@react-native-firebase/analytics';

export const AnalyticsEvents = {
  SCREEN_VIEW: 'screen_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SEARCH: 'search',
  TAB_CHANGE: 'tab_change',
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  CONTENT_VIEW: 'content_view',
  CONTENT_DOWNLOAD: 'content_download',
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_OPENED: 'notification_opened',
  ERROR_OCCURRED: 'error_occurred',
  API_CALL: 'api_call',
  API_ERROR: 'api_error',
} as const;

interface EventParams {
  [key: string]: any;
}

class AnalyticsService {
  async logEvent(eventName: string, params?: EventParams) {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async logScreenView(screenName: string, screenClass?: string) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Screen view error:', error);
    }
  }

  async logButtonClick(buttonName: string, screenName: string, additionalParams?: object) {
    await this.logEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: buttonName,
      screen_name: screenName,
      ...additionalParams,
    });
  }

  async logFormSubmit(formName: string, success: boolean, additionalParams?: object) {
    await this.logEvent(AnalyticsEvents.FORM_SUBMIT, {
      form_name: formName,
      success,
      ...additionalParams,
    });
  }

  async logSearch(searchTerm: string, resultCount?: number) {
    await this.logEvent(AnalyticsEvents.SEARCH, {
      search_term: searchTerm,
      result_count: resultCount,
    });
  }

  async logTabChange(fromTab: string, toTab: string) {
    await this.logEvent(AnalyticsEvents.TAB_CHANGE, {
      from_tab: fromTab,
      to_tab: toTab,
    });
  }

  async logModalOpen(modalName: string, trigger?: string) {
    await this.logEvent(AnalyticsEvents.MODAL_OPEN, {
      modal_name: modalName,
      trigger,
    });
  }

  async logModalClose(modalName: string, duration?: number) {
    await this.logEvent(AnalyticsEvents.MODAL_CLOSE, {
      modal_name: modalName,
      duration_ms: duration,
    });
  }

  async logContentView(contentType: string, contentId: string, additionalParams?: object) {
    await this.logEvent(AnalyticsEvents.CONTENT_VIEW, {
      content_type: contentType,
      content_id: contentId,
      ...additionalParams,
    });
  }

  async logContentDownload(contentType: string, contentId: string, fileSize?: number) {
    await this.logEvent(AnalyticsEvents.CONTENT_DOWNLOAD, {
      content_type: contentType,
      content_id: contentId,
      file_size: fileSize,
    });
  }

  async logNotificationReceived(notificationId: string, type?: string) {
    await this.logEvent(AnalyticsEvents.NOTIFICATION_RECEIVED, {
      notification_id: notificationId,
      notification_type: type,
    });
  }

  async logNotificationOpened(notificationId: string, type?: string) {
    await this.logEvent(AnalyticsEvents.NOTIFICATION_OPENED, {
      notification_id: notificationId,
      notification_type: type,
    });
  }

  async logApiCall(endpoint: string, method: string, duration: number, statusCode: number) {
    await this.logEvent(AnalyticsEvents.API_CALL, {
      endpoint,
      method,
      duration_ms: duration,
      status_code: statusCode,
    });
  }

  async logApiError(endpoint: string, method: string, errorMessage: string, statusCode?: number) {
    await this.logEvent(AnalyticsEvents.API_ERROR, {
      endpoint,
      method,
      error_message: errorMessage,
      status_code: statusCode,
    });
  }

  async logError(errorName: string, errorMessage: string, stackTrace?: string, additionalParams?: object) {
    await this.logEvent(AnalyticsEvents.ERROR_OCCURRED, {
      error_name: errorName,
      error_message: errorMessage,
      stack_trace: stackTrace,
      ...additionalParams,
    });
  }

  async setUserId(userId: string) {
    try {
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Set user ID error:', error);
    }
  }

  async setUserProperty(name: string, value: string) {
    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('Set user property error:', error);
    }
  }

  async resetAnalyticsData() {
    try {
      await analytics().resetAnalyticsData();
    } catch (error) {
      console.error('Reset analytics error:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
