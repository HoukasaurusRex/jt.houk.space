import { Construct } from "constructs";
import { MonitoringNotificationChannel } from "@cdktf/provider-google/lib/monitoring-notification-channel";
import { MonitoringAlertPolicy } from "@cdktf/provider-google/lib/monitoring-alert-policy";

export interface KeilaMonitoringConfig {
  alertEmail: string;
  serviceName: string;
}

export class KeilaMonitoring extends Construct {
  readonly notificationChannel: MonitoringNotificationChannel;
  readonly alertPolicy: MonitoringAlertPolicy;

  constructor(scope: Construct, id: string, config: KeilaMonitoringConfig) {
    super(scope, id);

    this.notificationChannel = new MonitoringNotificationChannel(
      this,
      "email-channel",
      {
        displayName: "Keila Alert Email",
        type: "email",
        labels: {
          email_address: config.alertEmail,
        },
      }
    );

    this.alertPolicy = new MonitoringAlertPolicy(this, "5xx-alert", {
      displayName: "Keila - High 5xx Error Rate",
      combiner: "OR",
      notificationChannels: [this.notificationChannel.name],
      conditions: [
        {
          displayName: "5xx error rate on Cloud Run",
          conditionThreshold: {
            filter: [
              `resource.type = "cloud_run_revision"`,
              `metric.type = "run.googleapis.com/request_count"`,
              `metric.label.response_code_class = "5xx"`,
            ].join(" AND "),
            comparison: "COMPARISON_GT",
            thresholdValue: 1.0,
            duration: "300s",
          },
        },
      ],
    });
  }
}
