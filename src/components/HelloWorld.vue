<template>
  <div>
    <div class="tool">
      <el-button @click="startDraw">测距</el-button>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import TXTileLayer from '../units/TXTileLayer'
export default {
  name: 'HelloWorld',
  mixins: [TXTileLayer],
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      let MapOption = {
        minZoom: 3,
        maxZoom: 14,
        center: [39.914271, 116.405419],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      }
      this.map = this.InitMap('map', MapOption)
      let url = 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      this.createLayer(url).addTo(this.map)
    },
    startDraw () {
      this.startDrawLine()
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>
<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
.tool {
    display: inline-block;
    float: left;
    margin-left: 50px;
}
</style>
