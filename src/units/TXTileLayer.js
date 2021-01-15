import L from 'leaflet'
import icon from '../assets/distance.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

export default {
  data () {
    return {
      DRAWLAYERS: [],
      BarDRAWLAYERS: [],
      DRAWING: false,
      ISMEASURE: false, // 是否是量距
      MEASURERESULT: 0, // 测量结果
      DRAWPOLYLINE: null, // 绘制的折线
      DRAWMOVEPOLYLINE: null, // 绘制过程中的折线
      DRAWPOLYLINEPOINTS: [], // 绘制的折线的节点集
      marker: null
    }
  },
  methods: {
    createLayer (url) {
      return L.tileLayer(url)
    },
    InitMap (el, option) {
      return L.map(el, option)
    },
    startDrawLine (func) {
      let _this = this
      this.ISMEASURE = true
      this.map.getContainer().style.cursor = 'crosshair'
      var shapeOptions = {
        color: '#F54124',
        weight: 3,
        opacity: 0.8,
        fill: false,
        clickable: true
      }
      this.DRAWPOLYLINE = new L.Polyline([], shapeOptions) // 绘制的折线
      this.map.addLayer(this.DRAWPOLYLINE)
      this.map.on('mousedown', onClick)
      this.map.on('dblclick', onDoubleClick)
      function onClick (e) {
        _this.DRAWING = true // 是否正在绘制
        _this.DRAWPOLYLINEPOINTS.push(e.latlng)
        if (_this.DRAWPOLYLINEPOINTS.length > 1 && _this.ISMEASURE) { // 是否是量距
          _this.MEASURERESULT += e.latlng.distanceTo(_this.DRAWPOLYLINEPOINTS[_this.DRAWPOLYLINEPOINTS.length - 2])
        }
        _this.DRAWPOLYLINE.addLatLng(e.latlng) // 绘制的折线
        _this.map.on('mousemove', onMove)
      }
      function onMove (e) {
        if (_this.DRAWING) { // 是否正在绘制
          if (_this.DRAWMOVEPOLYLINE !== undefined && _this.DRAWMOVEPOLYLINE != null) { // 绘制过程中的折线
            _this.map.removeLayer(_this.DRAWMOVEPOLYLINE)
            _this.marker.remove(_this.map)
          }
          var prevPoint = _this.DRAWPOLYLINEPOINTS[_this.DRAWPOLYLINEPOINTS.length - 1]
          _this.DRAWMOVEPOLYLINE = new L.Polyline([prevPoint, e.latlng], shapeOptions)
          _this.map.addLayer(_this.DRAWMOVEPOLYLINE)
          if (_this.ISMEASURE) {
            var distance = _this.MEASURERESULT + e.latlng.distanceTo(_this.DRAWPOLYLINEPOINTS[_this.DRAWPOLYLINEPOINTS.length - 1])
            _this.marker = L.marker(e.latlng, {
              icon: L.icon({
                iconUrl: icon,
                iconSize: [40, 40],
                iconAnchor: [40, 40],
                popupAnchor: [-3, -76],
                shadowUrl: iconShadow,
                shadowSize: [68, 95],
                shadowAnchor: [22, 94]
              })
            })
            _this.marker.addTo(_this.map)
              .bindTooltip('总长：' + (distance / 1000).toFixed(2) + '公里', {
                permanent: true,
                offset: [20, 28], // 偏移
                direction: 'bottom', // 放置位置
                className: 'anim-tooltip' // CSS控制
              }).openTooltip()
          }
        }
      }
      function onDoubleClick (e) {
        _this.map.getContainer().style.cursor = ''
        if (_this.DRAWING) {
          if (_this.DRAWMOVEPOLYLINE !== undefined && _this.DRAWMOVEPOLYLINE != null) {
            _this.map.removeLayer(_this.DRAWMOVEPOLYLINE)
            _this.DRAWMOVEPOLYLINE = null
          }
          _this.BarDRAWLAYERS.push(_this.DRAWPOLYLINE)
          _this.DRAWPOLYLINEPOINTS = []
          _this.DRAWING = false
          _this.ISMEASURE = false
          _this.map.off('mousedown')
          _this.map.off('mousemove')
          _this.map.off('dblclick')
        }
      }
    },
    clearAll () {
      this.map.removeLayer(this.DRAWPOLYLINE)
      this.map.removeLayer(this.marker)
    }
  }
}
