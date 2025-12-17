# Page Component Refactoring Rules

## 基础重构规则 (Basic Refactoring Rules)

1. **替换page中的标题内容为PageInfo组件**
   - 将硬编码的标题div替换为`<PageInfo title={t('commission.xxx.title')} />`组件
   - 如果有描述信息(通常是一个位于标题div下的一个只包含描述信息的div)，则在组件的desc的props中传入`<PageInfo title={t('commission.xxx.title')} desc={t('commission.xxx.desc')} />`

2. **在page中通过useColumnVisibility的hook引入ColumnVisibilityButton**
   - 导入并实现useColumnVisibility hook
   - 添加ColumnVisibilityButton组件
   - 使用特定存储键（如'commission-xxx-reports-table'），键值可以根据文件路径来确定

3. **使用DataTable替换page中现有的table组件**
   - 将table组件中的column定义提升到page中
   - 使用CRMColumnDef类型定义列
   - 替换为DataTable组件

4. **在重构过程中要特别注意ts类型，补充原先没有写好的ts类型**
   - 为setParams和setOtherParams添加正确的TypeScript类型定义
   - 使用适当的类型如`DailyRebateParams['params']`和`Omit<DailyRebateParams, 'params' | keyof BasicParams>`

5. **page中的RrhInputWithIcon需要通过keyword修改为可控组件**
   - 添加keyword状态
   - 添加value和onChange属性使其成为受控组件

6. **且支持在重置按钮点击时被清空**
   - 在reset函数中添加setKeyword('')清空搜索输入

7. **按照输出模板重构相关的form组件**
   - 创建新的Form组件在同一层级
   - 实现正确的初始化数据和重置功能（为此需要从外界传入params,reset等新的props）
   - 匹配FeesForm模板结构

8. **重构完成后需要删除现有的table组件**
   - 删除原有的Table组件文件

9. **并让form组件和page组件位于同一层级**
   - 将Form组件移动到与Page组件相同目录层级
   - 如果此时存在空的components文件夹，则删除该文件夹

### 新增规则 (Additional Rules)

10. **在定义allColumns时，如果来自原有table组件的columns的item里存在只有accessorKey字段而没有id字段的。新增一个id字段，id的值和accessorKey的值一致**
    - 为所有只有accessorKey的列添加id字段，确保id值与accessorKey相同，
    - 确保所有item都有一个唯一的id，如果出现id重复，向开发者请求确认
    - 如果存在id为operate的item，给该item添加fixed:'right'和size: 50的值。如果该item返回超过一个按钮，则参考RewardConfigsPage使用RrhDropdown和Ellipse组件进行整合
    - 所有id不是operate的item，都不应该有fixed和size的字段，如果有，删除这些字段
    - 如果item的header字段不是纯字符串或者t('xxx')，则新增一个label字段，label的值为header字段里的t('xxx')

11. **在重构代码的过程中，保持所有常量的引用，不要将引用替换为hardcode**
    - 保持使用RebateTypeOptions和RebateStatusOptions等常量
    - 避免硬编码选项数组

12. **重构RrhInputWithIcon时，如果组件使用的是onLeftIconClick，将其改为onRightIconClick**
    - 将onLeftIconClick事件改为onRightIconClick

13. **该组件的placeholder应该与当前form组件中的第一个input组件的placeholder相同**
    - RrhInputWithIcon的placeholder应与Form中第一个文本输入组件的placeholder保持一致

14. **onRightIconClick事件中需要添加对应（第一个input）的setState事件来触发数据更新**
    - 在onRightIconClick中添加对应的setState事件来更新相关参数

15. **新增规则：在重构form组件时，可以使用移动form的位置再改动form的代码的方式来替代新建一个form再删除原有form组件的方式以减少token消耗**
    - 移动现有的Form组件到与Page组件相同层级，而不是创建新的Form组件

16. **新增规则：如果form组件中使用了ref模式，去除掉ref**
    - 移除forwardRef和useImperativeHandle，简化为标准函数组件