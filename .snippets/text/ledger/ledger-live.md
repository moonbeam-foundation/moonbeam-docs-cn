## 使用Ledger Live发送&接收GLMR {: #use-ledger-live }

您也可以在Ledger Live使用Ledger设备安全地发送和接收GLMR Token。这使您可以在无需连接设备至MetaMask的情况下管理您的GLMR Token。

当您打开Ledger Live app时，确保您已安装最新版本。如果有任何待更新需要安装，系统将会跳出弹窗提示您安装更新。

在开始之前，您需要登陆您的Ledger设备进行解锁。在Ledger Live上点击**My Ledger**。随后您的设备将跳出提示，要求您允许Ledger manager。您可以点击设备上的两个按钮来通过允许。

在Ledger manager上，您将需要确保您的固件已更新，如果Moonbeam和/或以太坊app需要更新，请安装并更新至最新版本。

接下来，您将需要添加账户到您的Ledger Live app上。为此，请执行以下步骤：

1. 从左侧菜单栏点击**Accounts**
2. 选择**Add account**
3. 随后出现一个下拉菜单，搜索GLMR后会出现**Moonbeam (GLMR)**供您选择
4. 点击**Continue**

![Add account to Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-12.png)

接下来，您需要输入账号名称并点击**Add account**。如果您的账号成功添加后，您可以点击**Done**，然后您的账号会出现在账号列表中。

### 接收Token {: #receive-tokens_1 }

要在您的Ledger设备接收GLMR，您可以在Ledger Live上执行以下步骤：

1. 从左侧菜单栏点击**Receive**
2. 随后会跳出弹窗，您可以在**Account to credit**下拉菜单中选择您想要用于接收Token的Moonbeam账号
3. 点击**Continue**

![Verify receiving address in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-13.png)

接下来，您的地址应该会出现在Ledger Live上，并提示您在Ledger上验证地址。在您的设备上执行以下步骤：

1. 您应该在您的设备屏幕上看到**Verify Address**。点击右侧按钮开始验证地址
2. 在下一个显示屏幕中，您应该会看到您的地址。将您设备上的地址与Ledger Live上显示的地址进行比较，并验证其是否匹配。同时，您需要从Ledger Live复制地址用于发送交易。点击按钮继续下一步
3. 现在，您应该会看到**Approve**的屏幕。如果地址匹配，您可以点击设备上的两个按钮来通过验证。否则，您可以再次点击右侧按钮进入**Reject**屏幕，点击设备上的两个按钮来拒绝验证

![Verify receiving address on Ledger device](/images/tokens/connect/ledger/moonbeam/ledger-14.png)

在Ledger Live上，您将看地址已安全共享，您可以点击**Done**。现在，您可以发送一些GLMR到您的Ledger账号。

### 发送Token {: #send-tokens_1 }

要从Ledger设备发送GLMR，请在Ledger Live执行以下步骤：

1. 从左侧菜单栏点击**Send**
2. 随后会跳出弹窗，在**Account to debit**下拉菜单中，选择您想要用于发送Token的Moonbeam账号
3. 在**Receipient address**输入框中输入地址
4. 点击**Continue**

![Send transaction in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-15.png)

下一个屏幕中，您可以输入您想要发送的GLMR数量，然后点击**Continue**。

![Enter amount to send in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-16.png)

在Ledger Live上的最后一步是验证交易信息是否正确。如果一切无误后，您可以点击**Continue**，然后您会在Ledger设备上收到提示要求您确认交易：

1. 第一个屏幕是**Review transaction**。点击右侧按钮进入下一步
2. 验证您要发送的GLMR数量，并点击右侧按钮进入下一步
3. 验证您要发送的GLMR地址，并点击右侧按钮进入下一步
4. **Network**屏幕显示的为**Moonbeam**，点击右侧按钮进入下一步
5. 查看**Max Fees**，并点击右侧按钮进入下一步
6. 如果一切无误后，您可以点击两个按钮来**Accept and send**交易。否则，您可以点击右侧按钮进入**Reject**屏幕，点击设备上的两个按钮来拒绝验证

![Send transaction from Ledger device](/images/tokens/connect/ledger/moonbeam/ledger-17.png)

在Ledger Live上，您应该看到您的交易已成功发送，您可以查看交易详情。交易确认发送后，您的GLMR余额将会更新。

这样就可以了！您已成功通过Moonbeam Ledger Live集成直接在Ledger Live使用Ledger设备接收和发送Token。