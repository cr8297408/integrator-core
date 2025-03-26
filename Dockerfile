FROM public.ecr.aws/lambda/nodejs:18 as builder

COPY dist ${LAMBDA_TASK_ROOT}/dist
COPY package*.json ${LAMBDA_TASK_ROOT}
COPY node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY .env ${LAMBDA_TASK_ROOT}

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}

CMD ["dist/index.handler"]