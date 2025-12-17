# RevenueCat + Apple App Store Setup Guide

This guide walks through setting up RevenueCat with the Apple App Store for in-app purchases and subscriptions.

## Step 1: Create a RevenueCat Project

1. Sign up at [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create a new project
3. Note your **Public API Key** (starts with `appl_` for iOS)

## Step 2: Add Your iOS App in RevenueCat

1. Go to **Apps & Providers** in your project
2. Click **Add app config** → **Apple App Store**
3. Enter your app's **Bundle ID** (e.g., `com.yourcompany.yourapp`)

## Step 3: Generate & Upload Credentials

RevenueCat needs credentials to communicate with Apple. For **StoreKit 2** (recommended):

### A. Generate In-App Purchase Key

1. Go to [App Store Connect → Users and Access → Integrations → In-App Purchase](https://appstoreconnect.apple.com/access/integrations/api/subs)
2. Click **Generate In-App Purchase Key** (or "+" if you have existing keys)
3. Name your key and click **Generate**
4. **Download the .p8 file immediately** (you can only download once)
5. Note the **Key ID** displayed

### B. Upload to RevenueCat

1. In RevenueCat, go to your app's settings
2. Under **In-app purchase key configuration** tab
3. Upload your `.p8` file
4. Enter the **Key ID**
5. Enter the **Issuer ID** (shown at the top of the App Store Connect integrations page)

## Step 4: Create Products in App Store Connect

1. Go to [App Store Connect → My Apps](https://appstoreconnect.apple.com/apps)
2. Select your app → **In-App Purchases** or **Subscriptions**
3. Create your subscription products:
   - **Product ID**: e.g., `com.yourapp.monthly_premium`
   - **Reference Name**: Internal identifier
   - **Subscription Duration**: Monthly, Annual, etc.
   - **Price**: Set your pricing

## Step 5: Configure Products in RevenueCat

1. Go to **Products** in your RevenueCat project
2. Click **+ New Product**
3. Select your Apple App Store app
4. Enter the **Product Identifier** (must match App Store Connect exactly)
5. Set the product type (subscription, consumable, etc.)

## Step 6: Create Entitlements

Entitlements define what features users unlock:

1. Go to **Entitlements** in RevenueCat
2. Click **+ New Entitlement**
3. Create an identifier (e.g., `premium`)
4. Attach your products to this entitlement

## Step 7: Create Offerings

Offerings organize products for your paywall:

1. Go to **Offerings** in RevenueCat
2. Create a new offering (e.g., `default`)
3. Add **Packages** with your products:
   - `$rc_monthly` - Monthly subscription
   - `$rc_annual` - Annual subscription

## Step 8: Set Up Apple Server Notifications

This keeps RevenueCat in sync with Apple:

1. In RevenueCat, go to your app settings
2. Copy the **Apple Server Notification URL**
3. Go to App Store Connect → Your App → App Information
4. Under **App Store Server Notifications**, paste the URL
5. Select **Version 2** notifications

## Step 9: Install the SDK

### Swift Package Manager

```
https://github.com/RevenueCat/purchases-ios.git
```

### CocoaPods

```ruby
pod 'RevenueCat'
```

## Step 10: Configure the SDK

### API Keys Per Platform

RevenueCat generates a unique public SDK API key for each app/store you add. Keys are prefixed by platform:

| Platform        | Key Prefix | Example          |
| --------------- | ---------- | ---------------- |
| Apple App Store | `appl_`    | `appl_abc123...` |
| Google Play     | `goog_`    | `goog_xyz789...` |
| Amazon          | `amzn_`    | `amzn_def456...` |
| Stripe          | `strp_`    | `strp_ghi012...` |
| Test Store      | `test_`    | `test_jkl345...` |

Find your keys in: **RevenueCat Dashboard → Project Settings → API keys → App specific keys**

### iOS (Swift)

```swift
import RevenueCat

func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // Configure with your public API key
    Purchases.configure(withAPIKey: "appl_YOUR_PUBLIC_API_KEY")

    // Enable debug logs during development
    Purchases.logLevel = .debug

    return true
}
```

### Cross-Platform (React Native / Flutter)

For hybrid apps, initialize with the correct key per platform:

```typescript
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

const apiKey =
  Platform.OS === "ios" ? "appl_YOUR_IOS_KEY" : "goog_YOUR_ANDROID_KEY";

Purchases.configure({ apiKey });
```

### Environment Variables

Store your API keys in environment variables (see `.env.example`):

```bash
REVENUECAT_IOS_API_KEY=appl_...
REVENUECAT_ANDROID_API_KEY=goog_...
REVENUECAT_TEST_API_KEY=test_...
```

> **Warning:** Never use Test Store API keys in production builds. Apps will be rejected or purchases won't work.

## Step 11: Fetch & Display Offerings

```swift
Purchases.shared.getOfferings { (offerings, error) in
    if let offerings = offerings, let current = offerings.current {
        // Display packages to user
        for package in current.availablePackages {
            print("Product: \(package.storeProduct.localizedTitle)")
            print("Price: \(package.storeProduct.localizedPriceString)")
        }
    }
}
```

## Step 12: Make a Purchase

```swift
Purchases.shared.purchase(package: package) { (transaction, customerInfo, error, userCancelled) in
    if let error = error {
        // Handle error
        return
    }

    if customerInfo?.entitlements["premium"]?.isActive == true {
        // Unlock premium features
    }
}
```

## Step 13: Check Entitlement Status

```swift
Purchases.shared.getCustomerInfo { (customerInfo, error) in
    if customerInfo?.entitlements["premium"]?.isActive == true {
        // User has premium access
    }
}
```

## Quick Reference Checklist

| Step | Action                                            |
| ---- | ------------------------------------------------- |
| ☐    | Create RevenueCat project                         |
| ☐    | Add iOS app with Bundle ID                        |
| ☐    | Generate In-App Purchase Key in App Store Connect |
| ☐    | Upload .p8 key + Key ID + Issuer ID to RevenueCat |
| ☐    | Create products in App Store Connect              |
| ☐    | Add products to RevenueCat                        |
| ☐    | Create entitlements and attach products           |
| ☐    | Create offerings with packages                    |
| ☐    | Configure Apple Server Notifications v2           |
| ☐    | Install SDK in your app                           |
| ☐    | Initialize SDK on app launch                      |
| ☐    | Test in sandbox                                   |

## Testing in Sandbox

1. Create a [Sandbox Tester Account](https://appstoreconnect.apple.com/access/testers) in App Store Connect
2. Sign out of the App Store on your test device
3. When prompted during a test purchase, sign in with your sandbox account
4. Sandbox subscriptions renew faster for testing:
   - 1 week → 3 minutes
   - 1 month → 5 minutes
   - 1 year → 1 hour

## Troubleshooting

### Products not loading

- Verify Product IDs match exactly between App Store Connect and RevenueCat
- Ensure products are in "Ready to Submit" or "Approved" status
- Check that your app's Bundle ID matches RevenueCat configuration

### Purchases failing

- Verify your In-App Purchase Key is correctly uploaded
- Check that server notifications are configured
- Review RevenueCat debug logs for specific error messages

### Entitlements not updating

- Ensure Apple Server Notifications v2 are configured
- Verify products are attached to entitlements in RevenueCat
- Check that you're querying the correct entitlement identifier

## Resources

- [RevenueCat Documentation](https://docs.revenuecat.com)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [StoreKit Documentation](https://developer.apple.com/documentation/storekit)
