package org.activiti.rest.editor.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fui.cloud.common.CommonConstants;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Model;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@RestController
public class ModelSaveRestResource implements ModelDataJsonConstants {
    protected static final Logger LOGGER = LoggerFactory.getLogger(ModelSaveRestResource.class);
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    private ObjectMapper objectMapper;

    public ModelSaveRestResource() {
    }

    @RequestMapping(
            value = {"/model/{modelId}/save"},
            method = {RequestMethod.PUT}
    )
    @ResponseStatus(HttpStatus.OK)
    public void saveModel(@PathVariable String modelId, @RequestParam String name,
                          @RequestParam String json_xml, @RequestParam String svg_xml,
                          @RequestParam String description) {
        try {
            Model model = this.repositoryService.getModel(modelId);
            ObjectNode modelJson = (ObjectNode) this.objectMapper.readTree(model.getMetaInfo());
            modelJson.put(MODEL_NAME, name);
            modelJson.put(MODEL_DESCRIPTION, description);
            model.setMetaInfo(modelJson.toString());
            model.setName(name);
            this.repositoryService.saveModel(model);
            this.repositoryService.addModelEditorSource(model.getId(), json_xml.getBytes(CommonConstants.DEFAULT_CHARACTER));
            InputStream svgStream = new ByteArrayInputStream(svg_xml.getBytes(CommonConstants.DEFAULT_CHARACTER));
            TranscoderInput input = new TranscoderInput(svgStream);
            PNGTranscoder transCoder = new PNGTranscoder();
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            TranscoderOutput output = new TranscoderOutput(outStream);
            transCoder.transcode(input, output);
            byte[] result = outStream.toByteArray();
            this.repositoryService.addModelEditorSourceExtra(model.getId(), result);
            outStream.close();
        } catch (Exception var11) {
            LOGGER.error("Error saving model", var11);
            throw new ActivitiException("Error saving model", var11);
        }
    }
}
