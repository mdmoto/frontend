<template>
  <div>
    <!-- 统计 -->
    <div class="card">
      <h4>{{ $t("dashboard.basicInfo") }}</h4>
      <div class="count-list flex">
        <div class="count-item" @click="navigateTo('managerGoods')">
          <div>
            <Icon class="icon" size="31" type="md-photos" />
          </div>
          <div>
            <div class="counts">{{ homeData.goodsNum || 0 }}</div>
            <div>{{ $t("dashboard.goodsNum") }}</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('memberList')">
          <div>
            <Icon class="icon" size="31" type="md-person" />
          </div>
          <div>
            <div class="counts">{{ homeData.memberNum || 0 }}</div>
            <div>{{ $t("dashboard.memberNum") }}</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('orderList')">
          <div>
            <Icon class="icon" size="31" type="md-list" />
          </div>
          <div>
            <div class="counts">{{ homeData.orderNum || 0 }}</div>
            <div>{{ $t("dashboard.orderNum") }}</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('shopList')">
          <div>
            <Icon class="icon" size="31" type="ios-stats" />
          </div>
          <div>
            <div class="counts">{{ homeData.storeNum || 0 }}</div>
            <div>{{ $t("dashboard.shopNum") }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日待办 -->
    <div class="card">
      <h4>{{ $t("dashboard.todo") }}</h4>
      <div class="todo-list flex">
        <div class="todo-item" @click="navigateTo('applyGoods')">
          <div class="counts">{{ $store.state.notices.goods || 0 }}</div>
          <div>{{ $t("dashboard.waitAuditGoods") }}</div>
        </div>
        <div class="todo-item" @click="navigateTo('shopAuth')">
          <div class="counts">{{ $store.state.notices.store || 0 }}</div>
          <div>{{ $t("dashboard.waitAuditShop") }}</div>
        </div>
        <div class="todo-item" @click="navigateTo('orderComplaint')">
          <div class="counts">{{ $store.state.notices.complain || 0 }}</div>
          <div>{{ $t("dashboard.waitAuditComplain") }}</div>
        </div>
        <div class="todo-item" @click="navigateTo('afterSaleOrder')">
          <div class="counts">{{ $store.state.notices.refund || 0 }}</div>
          <div>{{ $t("dashboard.waitAuditAfterSale") }}</div>
        </div>
        <div class="todo-item">
          <div class="counts">
            {{ $store.state.notices.distributionCash || 0 }}
          </div>
          <div>{{ $t("dashboard.waitAuditWithdraw") }}</div>
        </div>
        <div class="todo-item" @click="navigateTo('accountStatementBill')">
          <div class="counts">{{ $store.state.notices.waitPayBill || 0 }}</div>
          <div>{{ $t("dashboard.waitAuditBill") }}</div>
        </div>
      </div>
    </div>

    <!-- 今日，流量概括 -->
    <div class="card flow">
      <div class="flow-list flex">
        <div class="flow-item">
          <div class="flow-member">
            <div>{{ $t("dashboard.onlineMember") }}</div>
            <span>
              {{ homeData.currentNumberPeopleOnline || 0 }}
            </span>
          </div>
          <div class="flow-wrapper">
            <h4>{{ $t("dashboard.trafficSummary") }}</h4>
            <div class="card flow-box flex">
              <div class="flow-box-item">
                <div>{{ $t("dashboard.todayUV") }}</div>
                <div class="counts">
                  {{ homeData.todayUV || 0 }}
                </div>
              </div>
              <div class="flow-box-item">
                <div>{{ $t("dashboard.yesterdayUV") }}</div>
                <div class="counts">
                  {{ homeData.yesterdayUV || 0 }}
                </div>
              </div>
            </div>

            <div class="flow-splice flex">
              <div class="flow-box-splice">
                <div>{{ $t("dashboard.lastSevenUV") }}</div>
                <div class="counts">
                  {{ homeData.lastSevenUV || 0 }}
                </div>
              </div>
              <div class="flow-box-splice">
                <div>{{ $t("dashboard.lastThirtyUV") }}</div>
                <div class="counts">
                  {{ homeData.lastThirtyUV || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="today-box">
          <h4>{{ $t("dashboard.todaySummary") }}</h4>
          <div class="today-list flex">
            <div class="today-item">
              <div>{{ $t("dashboard.todayOrderNum") }}</div>
              <span>{{ homeData.todayOrderNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>{{ $t("dashboard.todayOrderPrice") }}</div>
              <span v-if="homeData.todayOrderPrice"
                >￥{{ homeData.todayOrderPrice | unitPrice }}</span
              >
              <span v-else>￥0.00</span>
            </div>
            <div class="today-item">
              <div>{{ $t("dashboard.todayStoreNum") }}</div>
              <span>{{ homeData.todayStoreNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>{{ $t("dashboard.todayMemberNum") }}</div>
              <span>{{ homeData.todayMemberNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>{{ $t("dashboard.todayGoodsNum") }}</div>
              <span>{{ homeData.todayGoodsNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>{{ $t("dashboard.todayEvaluation") }}</div>
              <span>{{ homeData.todayMemberEvaluation || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- chart -->
    <div class="card transform">
      <div>
        <h4>{{ $t("dashboard.last48Hours") }}</h4>
        <div id="historyMemberChart"></div>
      </div>
    </div>
    <!-- chart -->
    <div class="charts flex">
      <div class="chart-item">
        <h4>{{ $t("dashboard.trafficTrend") }}</h4>
        <div id="pvChart"></div>
      </div>
      <div class="chart-item">
        <h4>{{ $t("dashboard.transactionTrend") }}</h4>
        <div id="orderChart"></div>
      </div>
    </div>

    <!-- top10商品 -->
    <div class="card transform">
      <h4>{{ $t("dashboard.hotGoodsTop10") }}</h4>
      <Table
        stripe
        :columns="tophotGoodsColumns"
        :data="topHotGoodsData"
      ></Table>
    </div>

    <!-- top10店铺 -->
    <div class="card transform">
      <h4>{{ $t("dashboard.hotShopsTop10") }}</h4>
      <Table
        stripe
        :columns="tophotShopsColumns"
        :data="topHotShopsData"
      ></Table>
    </div>
  </div>
</template>

<script>
import { homeStatistics, hotGoods, hotShops, getNoticePage } from "@/api/index";
import * as API_Goods from "@/api/goods";
import { Chart } from "@antv/g2";
import * as API_Member from "@/api/member";

export default {
  name: "home",

  data() {
    return {
      // 测试数据
      test: {
        a: "test",
        languages: [],
      },
      // 测试数据结束
      tophotShopsColumns: [
        // 表格表头
        {
          type: "index",
          width: 100,
          title: this.$t("dashboard.rank"),
          align: "center",
        },
        {
          title: this.$t("dashboard.shopName"),
          key: "storeName",
        },

        {
          title: this.$t("dashboard.price"),
          key: "price",

          render: (h, params) => {
            return h("priceColorScheme", {props:{value:params.row.price,color:this.$mainColor}} );
          },
        },
        {
          title: this.$t("dashboard.sales"),
          key: "num",
          width: 100,
          sortable: true,
        },
      ],

      tophotGoodsColumns: [
        {
          type: "index",
          width: 100,
          title: this.$t("dashboard.rank"),
          align: "center",
        },
        {
          title: this.$t("dashboard.goodsName"),
          key: "goodsName",
        },

        {
          title: this.$t("dashboard.price"),
          key: "price",
          render: (h, params) => {
            return h("priceColorScheme", {props:{value:params.row.price,color:this.$mainColor}} );
          },
        },
        {
          title: this.$t("dashboard.sales"),
          key: "num",
          width: 100,
          sortable: true,
        },
      ],
      topHotGoodsData: [], //热卖商品集合
      topHotShopsData: [], //热卖店铺集合
      awaitTodoData: "", //今日待办集合
      homeData: "", // 首页数据
      pvChart: "", // 流量统计
      orderChart: "", // 订单统计
      historyMemberChart: "", // 最近会员流量统计
      params: {
        // 请求参数
        searchType: "LAST_SEVEN",
      },
      // 订单传参
      orderParams: {
        searchType: "LAST_SEVEN", // TODAY ,  YESTERDAY , LAST_SEVEN , LAST_THIRTY
        year: "",
        shopId: "",
        memberId: "",
      },
    };
  },
  methods: {
    // 路由跳转
    navigateTo(name) {
      this.$router.push({
        name,
      });
    },
    // top10热卖商品
    async toHotGoods() {
      let res = await hotGoods(this.params);
      res.success ? (this.topHotGoodsData = res.result) : "";
    },

    // top10热卖店铺
    async topHotShops() {
      let res = await hotShops(this.params);
      res.success ? (this.topHotShopsData = res.result) : "";
    },
    // 今日待办
    async awaitTodo() {
      let res = await getNoticePage();
      res.success ? (this.awaitTodoData = res.result) : "";
    },

    //首页统计数据
    async getHomeData() {
      let res = await homeStatistics();
      if (res.success) {
        if (
          res.result.todayOrderPrice &&
          res.result.todayOrderPrice != "null"
        ) {
          res.result.todayOrderPrice = parseInt(res.result.todayOrderPrice);
        } else {
          res.result.todayOrderPrice = 0;
        }

        this.homeData = res.result;
      }
    },

    // 实例化订单图表
    async initOrderChartList(name) {
      this.orderChart ? this.orderChart.clear() : ''
      const res = await API_Goods.getOrderChart(this.orderParams);
      if (res.success) {
        this.chartList = res.result;

        if (!this.orderChart) {
          this.orderChart = new Chart({
            container: "orderChart",
            autoFit: true,
            height: 500,
            padding: [70, 70, 70, 70],
          });
        }

        this.initOrderChart(); //订单表
      }
    },

    // 订单表
    initOrderChart() {
      // 默认已经加载 legend-filter 交互
      let data = this.chartList;

      data.forEach((item) => {
        item.createTime = item.createTime.split(" ")[0];
        item.title = this.$t("dashboard.transactionAmount");
      });
      this.orderChart.data(data);

      this.orderChart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.orderChart
        .line()
        .position("createTime*price")
        .label("price")
        .color("title")
        .shape("smooth");

      this.orderChart
        .point()
        .position("createTime*price")
        .label("price")
        .color("title")
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1,
        });
        this.orderChart.area().position("createTime*price").color("title").shape("smooth");

      this.orderChart.render();
    },

    // 浏览量统计图
    initPvChart() {
      let uv = [];
      let pv = [];
      this.data.forEach((item) => {
        uv.push({
          date: item.date,
          uvNum: item.uvNum,
          title: this.$t("dashboard.uv"),
          pv: item.uvNum,
        });

        pv.push({
          date: item.date,
          pvNum: item.pvNum,
          pv: item.pvNum,
          title: this.$t("dashboard.pv"),
        });
      });

      let data = [...uv, ...pv];

      console.log("pv", data);
      this.pvChart.data(data);

      this.pvChart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.pvChart
        .line()
        .position("date*pv")
        .color("title")
        .label("pv")
        .shape("smooth");

      this.pvChart
        .point()
        .position("date*pv")
        .color("title")
        .label("pv")
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1,
        });
      this.pvChart.area().position("date*pv").color("title").shape("smooth");

      this.pvChart.render();
    },

    // 浏览量
    async getPvChart() {
      this.pvChart ? this.pvChart.clear() : ''
      API_Member.getStatisticsList(this.params).then((res) => {
        if (res.result) {
          this.data = res.result;

          if (!this.pvChart) {
            this.pvChart = new Chart({
              container: "pvChart",
              autoFit: true,
              height: 500,
              padding: [70, 70, 70, 70],
            });
          }
          this.initPvChart();
        }
      });
    },
    // 实例化会员流量图表
    async initHistoryMemberChartList() {
      this.historyMemberChart ? this.historyMemberChart.clear() : ''
      const res = await API_Member.historyMemberChartList();
      if (res.success) {
        this.chartList = res.result;

        if (!this.historyMemberChart) {
          this.historyMemberChart = new Chart({
            container: "historyMemberChart",
            autoFit: true,
            height: 500,
            padding: [70, 70, 70, 70],
          });
        }

        this.initHistoryMemberChart();
      }
    },
    // 历史在线人数
    initHistoryMemberChart() {
      // 默认已经加载 legend-filter 交互
      let data = this.chartList;
      let num = [];
      let lastNum = [];
      data.forEach((item) => {
        num.push({
          date: item.date.substring(5),
          title: this.$t("dashboard.last48HoursChart"),
          num: item.num,
          res: item.num,
        });

        lastNum.push({
          date: item.date.substring(5),
          title: this.$t("dashboard.lastPeriod"),
          lastNum: item.lastNum || 0,
          res: item.lastNum || 0,
        });
      });
      let params = [...num, ...lastNum];
      this.historyMemberChart.data(params);

      this.historyMemberChart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.historyMemberChart
        .line()
        .position("date*res")
        .color("title")
        .label("res")
        .shape("smooth");
      this.historyMemberChart
        .point()
        .position("date*res")
        .color("title")
        .label("res")
        .shape("circle");

      this.historyMemberChart
        .area()
        .position("date*res")
        .color("title")
        .shape("smooth");

      this.historyMemberChart.render();
    },
    // 初始化信息
    init() {
      this.toHotGoods();
      this.topHotShops();
      this.awaitTodo();
      this.getHomeData();
      this.getPvChart();
      this.initOrderChartList();
      this.initHistoryMemberChartList();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
@import "./home.scss";
</style>
