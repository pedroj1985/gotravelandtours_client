<template>
  <section class="space min">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div class="sec_title position-relative text-center mb-5">
            <h2 class="ft-normal text-center">Paquetes destacados</h2>
          </div>
        </div>
      </div>

      <div v-if="!loading">
        <div class="col-12 text-center mb-5"></div>

        <div class="row justify-content-center">
          <div
            class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
            v-for="packageItem of packages"
          >
            <div class="packages-grid-wrap effect_hover_pkg">
              <div class="packages-grid-upper">
                <div class="packages-pos ab-left">
                  <div class="packages-status nights me-2 br30 text-lowercase">
                    {{ packageItem.Paquete.id }} noches
                  </div>
                </div>
                <div class="packages-pos ab-right" style="margin-top: 30px;">
                  <div
                    class="packages-status open me-2 br30 text-lowercase"
                    style="text-transform: uppercase !important;"
                  >
                    DESTACADO
                  </div>
                </div>

                <a
                  v-on:click.prevent="downloadPdf(packageItem.Paquete.UrlAdjuntoPDF)"
                  class="btn-pdf d-flex justify-content-center align-items-center"
                  ><i class="mdi mdi-file-pdf-box" aria-hidden="true"></i
                ></a>

                <div class="packages-pos ab-right">
                  <div class="packages-status open me-2 br30">
                    #{{ packageItem.Paquete.PaqueteId }}
                  </div>
                </div>
                <div class="packages-grid-thumb">
                  <a class="d-block text-center m-auto">
                    <img
                      v-bind:src="packageItem.Paquete.ImagePaqueteContent"
                      class="img-fluid"
                      v-bind:alt="packageItem.Paquete.Nombre"
                  /></a>
                </div>
              </div>
              <div class="packages-grid-fl-wrap">
                <div class="packages-caption px-3 py-2">
                  <h4 class="mb-0 ft-medium medium mb-0" style="height: 60px;">
                    <a class="text-dark fs-md">
                      <span class="verified-badge">
                        <i class="mdi mdi-check-circle"></i>
                      </span>
                      {{ packageItem.Paquete.Nombre }}
                    </a>
                  </h4>
                  <div class="packages-middle-caption mt-3">
                    <div class="packages-facilities-wrap packages-flx mb-0">
                      <div class="packages-facility-list">
                        <ul class="no-list-style justify-content-center">
                          <li
                            data-bs-toggle="tooltip"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-bs-original-title="Pasaje"
                            aria-label="Pasaje"
                          >
                            <i
                              class="fas fa-plane"
                              style="color: rgb(0, 173, 238);"
                              aria-hidden="true"
                            ></i>
                          </li>
                          <li
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-bs-original-title="Traslado"
                            aria-label="Traslado"
                          >
                            <i
                              class="fas fa-shuttle-van"
                              style="color: rgb(0, 173, 238);"
                              aria-hidden="true"
                            ></i>
                          </li>
                          <li
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-bs-original-title="Hotel"
                            aria-label="Hotel"
                          >
                            <i
                              class="fas fa-bed"
                              style="color: rgb(0, 173, 238);"
                              aria-hidden="true"
                            ></i>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="packages-booking-button">
                      <a class="packages-btn-book"
                        >Desde USD
                        <span style="font-size: 20px; padding-left:5px;">
                          {{ packageItem.Paquete.PrecioPaqueteGeneral }}</span
                        >
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="col-12 text-center">
        <div class="col-12 text-center">
          <img
            src="https://sevenstravel.com.uy/web/assets/img/icons/loader.svg"
            alt="Buscando..."
            width="180"
            class="m-auto"
          />
          <h3 class="w-100 text-center">
            Estamos buscando los paquetes para tu selección.
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slick from "vue-slick-carousel";
import { getPackages } from "@/utils/auth";
import moment from "moment/moment";

export default {
  components: {
    Slick
  },
  methods: {
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = (number - intPart).toFixed(2) * 100;

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    downloadPdf(url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.click();
    }
  },
  data() {
    return {
      loading: true,
      packages: []
    };
  },
  mounted() {
    const currentDate = new Date();
    const query = {
      Nombre: null,
      IsActivo: true,
      FechaI: moment(currentDate).format("YYYY-MM-D")
    };
    getPackages(query)
      .then(response => {
        this.packages = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>

<style scoped>
.packages-grid-wrap {
  position: relative;
  width: 100%;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 2px 1px 5px rgba(0, 0, 0, 35%);
}

.packages-grid-fl-wrap {
  float: left;
  width: 100%;
  position: relative;
  border: 1px solid #eeeeee;
  border-radius: 0 0 10px 10px;
  overflow: initial;
}

.packages-grid-upper {
  position: relative;
  width: 100%;
  display: block;
}

.packages-grid-thumb a {
  display: block;
  position: relative;
}

.packages-grid-thumb a img {
  position: relative;
  display: block;
  width: 100%;
}

.packages-grid-thumb a:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0.2;
  background: #202838;
  z-index: 1;
}

.packages-author {
  position: absolute;
  right: 10px;
  bottom: 125px;
  width: 55px;
  height: 55px;
  object-fit: cover;
  border: 4px solid #ffffff;
  border-radius: 50%;
  z-index: 2;
  background: #fff;
}

.packages-author a {
  display: block;
  position: relative;
}

.packages-cates a {
  font-size: 11px;
  color: #00abd1;
  font-weight: 500;
  text-transform: uppercase;
  margin-right: 5px;
}

.packages-caption {
  position: relative;
  display: flex;
  flex-direction: column;
}

.packages-middle-caption div {
  font-size: 14px;
  margin-bottom: 10px;
  color: #6c717e;
}

.packages-middle-caption div i {
  margin-right: 7px;
  opacity: 0.8;
}

.packages-grid-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed #eeeeee;
}

.packages-bookmark-btn {
  position: absolute;
  right: 15px;
  top: 10px;
  z-index: 2;
}

.packages-bookmark-btn button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: none;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.packages-pos {
  position: absolute;
  display: inline-flex;
  align-items: center;
  z-index: 2;
}

.packages-featured-tag {
  position: relative;
  z-index: 3;
  background-color: rgb(0, 173, 238);
  letter-spacing: 0.5px;
  padding: 4px 12px;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 15px;
  font-size: 11px;
  color: #fff;
}

.packages-featured-tag:before,
.packages-featured-tag:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
}

.packages-status {
  font-size: 11px;
  font-weight: 500;
  color: #ffffff;
  background: #282525;
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.packages-status.open {
  background: rgba(188, 208, 29, 80%);
}

.packages-status.close {
  background: #1683f4;
}

.packages-status.offer {
  background: #ff5018;
}

.packages-status.nights {
  background: rgba(33, 47, 61, 80%);
}

span.verified-badge {
  margin-left: 5px;
  position: relative;
  top: 2px;
  color: rgb(0, 173, 238);
}

.packages-ft-first {
  display: inline-flex;
  align-items: center;
  width: auto;
  position: relative;
}

.packages-rating {
  display: inline-flex;
  position: relative;
  margin-right: 10px;
  align-items: center;
}

.packages-pr-average {
  padding: 2px 8px;
  background: #323232;
  display: inline-flex;
  margin-right: 4px;
  border-radius: 2px;
  font-weight: 500;
  color: #ffffff;
}

.packages-rates {
  font-size: 9px;
  color: #ff9800;
}

.packages-price-range {
  font-size: 12px;
  color: #989bb1;
}

.packages-price-range .active {
  color: #41434c;
}

.packages-pr-average.high {
  background: #07a262;
}

.packages-pr-average.mid {
  background: #ff6e19;
}

.packages-pr-average.poor {
  background: #f22b2b;
}

.packages-rating.overlay {
  position: absolute;
  left: 10px;
  bottom: 15px;
  z-index: 2;
}

.packages-rating.overlay .packages-pr-average {
  padding: 7px 10px;
  border-radius: 4px;
}

.packages-rating.overlay .packages-rates {
  font-size: 10px;
  color: #ff9d0c;
  letter-spacing: 1px;
}

.packages-aldeio {
  display: inline-block;
  margin-left: 5px;
}

.packages-all-review {
  line-height: 1.4;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.packages-cats-wrap {
  display: inline-flex;
  align-items: center;
  position: relative;
}

.packages-cats-wrap .cats-ico {
  width: 30px;
  height: 30px;
  display: inline-flex;
  border-radius: 50%;
  background: #323232;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  margin-right: 5px;
}

.packages-cats-wrap .cats-title {
  font-size: 13px;
  font-weight: 500;
}

.packages-inline .packages-bookmark-btn {
  position: relative;
  margin-left: 8px;
  display: inline-block;
  right: 0;
  top: 0;
}

.packages-inline .packages-bookmark-btn button {
  background: #ffffff;
  border: 1px solid #eeeeee;
  color: #707d9b;
}

.packages-ft-last,
.packages-inline {
  display: inline-flex;
}

.packages-cates.multi .cats-1 {
  padding: 2px 7px;
  background: rgba(33, 150, 243, 0.13);
  border-radius: 2px;
  color: #2196f3;
}

.packages-cates.multi .cats-2 {
  padding: 2px 7px;
  background: rgba(255, 87, 34, 0.13);
  border-radius: 2px;
  color: #ff5722;
}

.packages-cates.multi a {
  padding: 2px 7px;
  background: #f0f2f7;
  border-radius: 2px;
  color: #6d7691;
}

.packages-facilities-wrap {
  display: inline-flex;
  width: auto;
  position: relative;
}

.packages-facilities-wrap ul {
  padding: 0;
  margin-left: 10px;
  width: auto;
  display: inline-flex;
  margin-bottom: 0;
}

.packages-facilities-wrap ul li {
  margin-right: 5px;
  color: #00abd1;
}

.packages-facility-title {
  font-weight: 600;
  color: #172228 !important;
}

.packages-overlay-caps {
  position: absolute;
  bottom: 10px;
  left: 12px;
  z-index: 2;
}

.packages-distance {
  line-height: 1;
}

.packages-room-price {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: rgba(33, 150, 243, 0.13);
  border-radius: 2px;
  color: #2196f3;
  max-width: 110px;
  font-weight: 400;
  font-size: 13px;
}

.packages-room-price span {
  font-weight: 500;
  margin-right: 5px;
}

.packages-facilities-wrap.packages-flx {
  width: 100%;
}

.packages-flx .packages-facility-list {
  width: 100%;
}

.packages-facilities-wrap.packages-flx ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  width: 100%;
  flex-grow: 1;
}

.packages-facilities-wrap.packages-flx ul li {
  color: #a6aab7;
  margin: 0;
  font-size: 17px;
}

.packages-btn-book {
  display: flex;
  align-items: baseline;
  justify-content: center;
  height: 48px;
  background: #212f3d;
  border: 2px solid #212f3d;
  border-radius: 5px;
  font-weight: 500;
  color: #ffffff !important;
  margin-top: 0.5rem;
  transition: all ease 0.4s;
  line-height: 48px;
  font-family: "Antonio Regular", serif;
  cursor: pointer;
}

.packages-btn-book:hover,
.packages-btn-book:focus,
.packages-btn-book:active {
  background-color: #ffffff !important;
  color: #212f3d !important;
}

span.packages-apr-rates {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  padding: 0 8px;
  background: rgb(255 87 34 / 12%);
  border-radius: 2px;
  font-weight: 500;
  color: #ff5722;
}

span.packages-apr-rates i {
  font-size: 10px;
  margin-right: 4px;
}

.packages-options-list ul {
  display: flex;
  align-items: start;
  justify-content: center;
  margin: 0;
  padding: 0;
  flex-flow: wrap;
}

.packages-options-list ul li {
  width: 50%;
  align-items: center;
  justify-content: flex-start;
  flex: 0 0 50%;
  padding: 7px 0;
}

.packages-options-list ul li i {
  color: #a6aab7;
}

.packages-prt-price {
  display: inline-flex;
  align-items: center;
  font-size: 17px;
  font-weight: 500;
  color: #ffffff;
}

.packages-prt-price span {
  font-size: 25px;
  margin-left: 5px;
}

.packages-cats-wrap .cats-ico.bg-1 {
  background: #545f57;
}

.packages-cats-wrap .cats-ico.bg-2 {
  background: #764067;
}

.packages-cats-wrap .cats-ico.bg-3 {
  background: #d86963;
}

.packages-cats-wrap .cats-ico.bg-4 {
  background: #eacc84;
}

.packages-cats-wrap .cats-ico.bg-5 {
  background: #35bbcb;
}

.packages-cats-wrap .cats-ico.bg-6 {
  background: #f8d910;
}

.packages-cats-wrap .cats-ico.bg-7 {
  background: #0191b5;
}

.packages-cats-wrap .cats-ico.bg-8 {
  background: #d4dd18;
}

.packages-cats-wrap .cats-ico.bg-9 {
  background: #fe7a15;
}

.packages-cats-wrap .cats-ico.bg-10 {
  background: #004e99;
}

.btn-pdf {
  background: #ffffff;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 100;
  border-radius: 30px;
  color: #fa0f00;
}

@media (min-width: 768px) {
  .packages-grid-thumb a img {
    min-height: 200px;
    max-height: 200px;
    object-fit: cover;
  }
}
</style>
