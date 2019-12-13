<style lang="scss">
    @import './404.scss';
</style>

<template>
    <div class="error404">
        <div class="error404-body-con">
            <Card>
                <!-- <img src="../../assets/img/404.gif" alt=""> -->
                <h2>抱歉，您访问的页面出错了</h2>
                <p>您可能输错了网址，或该网页已删除或不存在</p>
                <div class="error404-btn-con">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">退出</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回首页</Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error404',
    methods: {
        backPage () {
            this.$router.push('/LightBox/LightOverview')
        },
        goHome () {
            this.$router.push('/Login')
        }
    }
};
</script>
<style>
.error404 h2 {
    font-size: 32px;
    color: #333333;
    text-align: center;
    letter-spacing: 5px;
    padding-top: 33px;
    padding-bottom: 25px;
}
.error404 p {
    font-size: 14px;
    color: #666666;
    letter-spacing: 1px;
    text-align: center;
    padding-bottom: 35px;
}
</style>
